import { CommonModule }                                                                        from '@angular/common';
import { Component, ViewChild }                                                                from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators }                             from '@angular/forms';
import { ActivatedRoute, Router }                                                              from '@angular/router';
import { NavController }                                                                       from '@ionic/angular';
import { IonContent, IonSelect, IonSelectOption, IonIcon, IonCheckbox, IonFooter, IonToolbar } from '@ionic/angular/standalone';
import { ComponentModule }                                                                     from 'src/app/components/component.module';
import { Address, CreateAddressRequest }                                                       from 'src/app/shared/interfaces/address/address.interface';
import { Country }                                                                             from 'src/app/shared/interfaces/country/country.interface';
import { PlaceSearchResult }                                                                   from 'src/app/shared/interfaces/google-maps/place-search-result.interface';
import { CountryService }                                                                      from 'src/app/shared/services';
import { AddressService }                                                                      from 'src/app/shared/services/address.service';

@Component({
  selector: 'app-create-address',
  templateUrl: './create-address.page.html',
  styleUrls: ['./create-address.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonContent,
    ComponentModule,
    IonSelect,
    IonSelectOption,
    CommonModule,
    IonCheckbox,
    IonFooter,
    IonToolbar,
    ReactiveFormsModule
  ]
})
export class CreateAddressPage {
  @ViewChild('inputAddress', { static: false }) inputAddress!: any;

  form!: FormGroup;
  countries: Country[] = [];
  selectedCountryCode: string = 'IT';
  isSubmitting: boolean = false;
  isEditMode: boolean = false;
  addressId: string | null = null;
  currentAddress: Address | null = null;
  isLoadingAddress: boolean = false;

  autocomplete!: google.maps.places.Autocomplete;
  placesService!: google.maps.places.PlacesService;
  place: PlaceSearchResult = {} as PlaceSearchResult;

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private addressService: AddressService,
    private navCtrl: NavController,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.initForm();
    this.checkEditMode();
    this.getCountries();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.inputAddress && this.inputAddress.nativeElement) {
        const input = this.inputAddress.nativeElement;
        this.autocomplete = new google.maps.places.Autocomplete(input);
        this.cargarPlaces();
      }
    }, 100);
  }
  checkEditMode() {
    this.activatedRoute.params.subscribe(params => {
      this.addressId = params['id'] || null;
      this.isEditMode = !!this.addressId;

      if (this.isEditMode && this.addressId) {
        this.loadAddressData(this.addressId);
      }
    });
  }
  loadAddressData(id: string) {
    this.isLoadingAddress = true;

    this.addressService.getAddressById(id).subscribe({
      next: (address: Address) => {
        this.currentAddress = address;
        this.populateForm(address);
        this.isLoadingAddress = false;
      },
      error: (error) => {
        this.isLoadingAddress = false;
        this.navCtrl.back();
      }
    });
  }

  populateForm(address: Address) {
    const phonePrefix = this.extractPhonePrefix(address.phoneNumber!);
    const phoneNumber = this.extractPhoneNumber(address.phoneNumber!, phonePrefix);

    this.form.patchValue({
      nickname: address.nickname || '',
      name: address.name,
      phonePrefix: phonePrefix,
      phoneNumber: phoneNumber,
      address: address.address,
      nro: address.nro,
      locality: address.locality,
      province: address.provice,
      CAP: address.CAP,
      deliveryInstructions: address.deliveryInstructions || '',
      predefine: address.defaultAddress
    });
    const country = this.countries.find(c => c.id === address.country?.id);
    if (country) {
      this.selectedCountryCode = country.code!;
    }
    if (address.latitude && address.longitude) {
      this.place = {
        ...this.place,
        address: address.address!,
        center: {
          lat: parseFloat(address.latitude),
          lng: parseFloat(address.longitude)
        }
      };
    }
  }

  extractPhonePrefix(fullPhone: string): string {
    const matchedCountry = this.countries.find(c =>
      fullPhone.startsWith(c.phonePrefix || '')
    );
    return matchedCountry?.phonePrefix || '+39';
  }

  extractPhoneNumber(fullPhone: string, prefix: string): string {
    return fullPhone.replace(prefix, '');
  }

  initForm() {
    this.form = this.fb.group({
      nickname: [''],
      name: ['', [Validators.required]],
      phonePrefix: ['+39', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      address: ['', [Validators.required]],
      nro: ['', [Validators.required]],
      locality: ['', [Validators.required]],
      province: ['', [Validators.required]],
      CAP: ['', [Validators.required]],
      deliveryInstructions: [''],
      predefine: [false]
    });
  }

  onCountryChange(event: any) {
    const selected = event.detail.value;
    const country = this.countries.find(c => c.phonePrefix === selected);
    if (country) {
      this.selectedCountryCode = country.code!;
    }
  }

  getCountries() {
    this.countryService.findAll().subscribe({
      next: (response) => {
        this.countries = response;
        if (!this.isEditMode) {
          const defaultCountry = this.countries.find(c => c.code === 'IT');
          if (defaultCountry) {
            this.form.patchValue({ phonePrefix: defaultCountry.phonePrefix });
            this.selectedCountryCode = defaultCountry.code!;
          }
        } else if (this.currentAddress) {
          this.populateForm(this.currentAddress);
        }
      }
    });
  }

  cargarPlaces() {
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      if (!place.geometry || !place.geometry.location) return;
      this.actualizarLugar(place);
    });
  }

  actualizarLugar(place: any) {
    const lat = typeof place.geometry.location.lat === 'function'
      ? place.geometry.location.lat()
      : place.geometry.location.lat;
    const lng = typeof place.geometry.location.lng === 'function'
      ? place.geometry.location.lng()
      : place.geometry.location.lng;

    if (typeof lat !== 'number' || typeof lng !== 'number') return;

    this.place = {
      address: place.formatted_address,
      name: place.name,
      location: place.geometry.location,
      iconUrl: place.icon,
      imgUrl: place.photos?.[0]?.getUrl() || '',
      center: { lat, lng },
    };

    this.form.patchValue({
      address: place.formatted_address || place.name
    });
  }

  onCancel() {
    this.navCtrl.back();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.form.value;

    const selectedCountry = this.countries.find(
      c => c.phonePrefix === formValue.phonePrefix
    );

    if (!selectedCountry || !selectedCountry.id) {
      console.error('País no seleccionado correctamente');
      this.isSubmitting = false;
      return;
    }

    const payload: CreateAddressRequest = {
      nickname: formValue.nickname || '',
      name: formValue.name,
      phoneNumber: `${formValue.phonePrefix}${formValue.phoneNumber}`,
      address: formValue.address,
      latitude: this.place.center?.lat?.toString() || '0',
      longitude: this.place.center?.lng?.toString() || '0',
      nro: formValue.nro,
      locality: formValue.locality,
      provice: formValue.province,
      CAP: formValue.CAP,
      deliveryInstructions: formValue.deliveryInstructions || '',
      status: true,
      defaultAddress: formValue.predefine,
      country: {
        id: selectedCountry.id
      }
    };

    if (this.isEditMode && this.addressId) {
      this.updateAddress(payload);
    } else {
      this.createAddress(payload);
    }
  }

  createAddress(payload: CreateAddressRequest) {
    this.addressService.createAddress(payload).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.addressService.getAllMyAddress().subscribe();
        this.navCtrl.back();
      },
      error: (error) => {
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  updateAddress(payload: CreateAddressRequest) {
    this.addressService.update(payload, this.addressId!).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.addressService.getAllMyAddress().subscribe();
        this.navCtrl.back();
      },
      error: (error) => {
        console.error('Error updating address:', error);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getTitle(): string {
    return this.isEditMode ? 'Modifica profilo di spedizione' : 'Crea profilo di spedizione';
  }

  getSubmitButtonText(): string {
    if (this.isSubmitting) {
      return this.isEditMode ? 'Aggiornando...' : 'Salvando...';
    }
    return this.isEditMode ? 'Aggiorna modifiche' : 'Salva modifiche';
  }
}
