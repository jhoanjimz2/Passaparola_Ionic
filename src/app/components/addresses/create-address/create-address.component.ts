import { Component, Input, ViewChild }         from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription }                        from 'rxjs';
import { Country }                             from 'src/app/shared/interfaces/country/country.interface';
import { PlaceSearchResult }                   from 'src/app/shared/interfaces/google-maps/place-search-result.interface';
import { CountryService }                      from 'src/app/shared/services';
import { KeyboardService }                     from 'src/app/shared/services/keyboard.service';
import { required }                            from 'src/app/shared/validators/events.validator';
import { CancelEditAddressComponent }          from '../cancel-edit-address/cancel-edit-address.component';
import { ModalController }                     from '@ionic/angular';

@Component({
  selector: 'app-create-address',
  templateUrl: './create-address.component.html',
  styleUrls: ['./create-address.component.scss'],
})
export class CreateAddressComponent {
  @ViewChild('inputAddress', { static: false }) inputAddress!: any;
  @Input() edit: boolean = false;

  autocomplete!: google.maps.places.Autocomplete;
  placesService!: google.maps.places.PlacesService;
  place: PlaceSearchResult = {} as PlaceSearchResult;

  isKeyboardOpen = false;
  keyboardSub!: Subscription;

  form: FormGroup = this.fb.group({
    nickname: new FormControl('', [required()] ),
    name: new FormControl('', [required()] ),
    phonePrefix: new FormControl('', [required()] ),
    phoneNumber: new FormControl('', [required()] ),
    address: new FormControl('', [required()] ),
    numberHouse: new FormControl('', [required()] ),
    localidad: new FormControl('', [required()] ),
    provincia: new FormControl('', [required()] ),
    cap: new FormControl('', [required()] ),
    description: new FormControl('', [required()] ),
    predefine: new FormControl(false, [required()] ),
  });

  countries: Country[] = [];
  selectedCountryCode: string = 'IT';

  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private keyboardService: KeyboardService,
    private modalController: ModalController
  ) {
    this.keyboardSub = this.keyboardService.isKeyboardOpen$.subscribe(isOpen => {
      this.isKeyboardOpen = isOpen;
    });
    this.getCountries();
  }
  ngOnDestroy(): void {
    if (this.keyboardSub) this.keyboardSub.unsubscribe();
  }

  ngAfterViewInit() {
    this.inputAddress.getInputElement().then((input: HTMLInputElement) => {
      this.autocomplete = new google.maps.places.Autocomplete(input);
      this.cargarPlaces();
    });
  }

  onCountryChange(event: any) {
    const selected = event.detail.value;
    const country = this.countries.find(c => c.phonePrefix === selected);
    this.selectedCountryCode = country!.code!;
  }

  getCountries() {
    this.countryService.findAll().subscribe({
      next: (response) => {
        this.countries = response;
        const selected = this.form.get('phonePrefix')?.value;
        const country = this.countries.find(c => c.phonePrefix === selected);
        this.selectedCountryCode = country!.code;
      },
      error: (error) => console.error(error),
      complete: () => {},
    });
  }


  updateAddress() {}

  cargarPlaces() {
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      if (!place.geometry || !place.geometry.location) return;
      this.actualizarLugar(place);
    });
  }
  actualizarLugar(place: any) {
    const lat = typeof place.geometry.location.lat === 'function' ? place.geometry.location.lat() : place.geometry.location.lat;
    const lng = typeof place.geometry.location.lng === 'function' ? place.geometry.location.lng() : place.geometry.location.lng;

    if (typeof lat !== 'number' || typeof lng !== 'number') return;

    this.place = {
      address: place.formatted_address,
      name: place.name,
      location: place.geometry.location,
      iconUrl: place.icon,
      imgUrl: place.photos?.[0]?.getUrl() || '',
      center: { lat, lng },
    };
  }

  async modalCancelEditAddress() {
    const modal = await this.modalController.create({
      component: CancelEditAddressComponent,
      cssClass: [ 'modal-80vh'],
      backdropDismiss: false
      // breakpoints: [0,1],
      // initialBreakpoint: 1,
    });
    await modal.present();
  }

}
