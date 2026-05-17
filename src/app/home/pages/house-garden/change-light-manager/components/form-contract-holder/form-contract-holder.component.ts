import { CommonModule }                                                                from '@angular/common';
import { Component, EventEmitter, Input, Output }                                      from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators }        from '@angular/forms';
import { IonSelect, IonSelectOption, IonRadio, IonRadioGroup }                         from '@ionic/angular/standalone';
import { Contract }                                                                    from 'src/app/shared/interfaces/contract/contract';
import { Country }                                                                     from 'src/app/shared/interfaces/country/country.interface';
import { CountryService }                                                              from 'src/app/shared/services';

@Component({
  selector: 'app-form-contract-holder',
  templateUrl: './form-contract-holder.component.html',
  styleUrls: ['./form-contract-holder.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonSelect,
    IonSelectOption,
    IonRadio,
    IonRadioGroup,
    CommonModule
  ]
})
export class FormContractHolderComponent  {
  @Input() contract: Contract = {} as Contract;
  @Output() save_data = new EventEmitter<any>();

  countries: Country[] = [];

  form: FormGroup = this.formBuilder.group({
    firstAndLastName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    streetNumber: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    province: new FormControl('', [Validators.required, Validators.maxLength(2)]),
    cap: new FormControl('', [Validators.required, Validators.pattern(/^\d{5,6}$/)]),
    dateOfBirth: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    cityOfBirth: new FormControl('', [Validators.required]),
    province2: new FormControl('', [Validators.required, Validators.maxLength(2)]),
    gender: new FormControl('', [Validators.required]),
    taxId: new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]),
    countryPhone: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private formBuilder: FormBuilder,
    private countryService: CountryService
  ) {
    this.getCountries()
  }

  getCountries() {
    this.countryService.findAll().subscribe({
      next: (response) => {
        this.countries = response;
        // this.fillTestData()
      },
      error: (error) => console.error(error),
      complete: () => {},
    });
  }

  // Función para rellenar el formulario con datos de prueba
  fillTestData() {
    this.form.patchValue({
      firstAndLastName: 'Mario Rossi',
      address: 'Via Roma',
      streetNumber: '123',
      city: 'Roma',
      province: 'RM',
      cap: '00100',
      dateOfBirth: '15/03/1985',
      country: '7814baa0-171c-4892-9e94-56b1cb9c9d04',
      cityOfBirth: 'Milano',
      province2: 'MI',
      gender: 'm',
      taxId: 'RSSMRA85C15F205X',
      countryPhone: '+39',
      phoneNumber: '3331234567',
      email: 'mario.rossi@example.com'
    });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formValue = this.form.value;

      // Formatear los datos según la estructura requerida
      const formattedData = {
        firstAndLastName: formValue.firstAndLastName,
        address: formValue.address,
        streetNumber: formValue.streetNumber,
        city: formValue.city,
        province: formValue.province,
        cap: formValue.cap,
        dateOfBirth: formValue.dateOfBirth,
        country: {
          id: formValue.country
        },
        cityOfBirth: formValue.cityOfBirth,
        province2: formValue.province2,
        gender: formValue.gender,
        taxId: formValue.taxId,
        phoneNumber: `${formValue.countryPhone}${formValue.phoneNumber}`, // Concatenar código de país + número
        email: formValue.email
      };

      this.save_data.emit({
        data: formattedData,
        step: 2
      });
    } else {
      const firstInvalidControl = this.getFirstInvalidControl();
      if (firstInvalidControl) {
        firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  private getFirstInvalidControl(): HTMLElement | null {
    const invalidControl = Object.keys(this.form.controls).find(key =>
      this.form.get(key)?.invalid
    );
    if (invalidControl) {
      return document.querySelector(`[name="${invalidControl}"]`);
    }
    return null;
  }

  hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.hasError('required')) {
      return 'Campo obbligatorio';
    }
    if (field?.hasError('email')) {
      return 'Email non valida';
    }
    if (field?.hasError('pattern')) {
      return 'Formato non valido';
    }
    if (field?.hasError('minlength') || field?.hasError('maxlength')) {
      return 'Lunghezza non valida';
    }
    return '';
  }
}
