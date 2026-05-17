import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonCheckbox,
  IonRadio,
  IonRadioGroup,
} from '@ionic/angular/standalone';
import { Contract } from 'src/app/shared/interfaces/contract/contract';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-delivery-address',
  templateUrl: './form-delivery-address.component.html',
  styleUrls: ['./form-delivery-address.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonRadio,
    IonRadioGroup,
    IonCheckbox,
    CommonModule,
  ],
})
export class FormDeliveryAddressComponent implements OnInit {
  @Input() contract: Contract = {} as Contract;
  @Output() save_data = new EventEmitter<any>();

  formDelivery: FormGroup = this.formBuilder.group({
    sameResidence: new FormControl('no', [Validators.required]),
    supplyStreet: new FormControl('', [Validators.required]),
    supplyNumber: new FormControl('', [Validators.required]),
    supplyCity: new FormControl('', [Validators.required]),
    supplyPr: new FormControl('', [
      Validators.required,
      Validators.maxLength(2),
    ]),
    supplyCap: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{5,6}$/),
    ]),
    supplyPdrPod: new FormControl('', [Validators.required]),
    currentPower: new FormControl(''),
    powerRequired: new FormControl(''),
    currentSupplier: new FormControl('', [Validators.required]),
    voltage: new FormControl(''),
    immediateActivation: new FormControl(false),
    activationDate: new FormControl(''),
  });

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    // Escuchar cambios en "sameResidence" para autocompletar la dirección
    this.formDelivery.get('sameResidence')?.valueChanges.subscribe((value) => {
      if (value === 'si') {
        this.fillAddressFromContract();
      } else {
        this.clearAddressFields();
      }
    });

    // Escuchar cambios en "immediateActivation" para manejar la fecha
    this.formDelivery
      .get('immediateActivation')
      ?.valueChanges.subscribe((checked) => {
        const dateControl = this.formDelivery.get('activationDate');
        if (checked) {
          dateControl?.clearValidators();
          dateControl?.setValue('');
        } else {
          dateControl?.setValidators([Validators.required]);
        }
        dateControl?.updateValueAndValidity();
      });

    // this.fillTestData()
  }

  fillAddressFromContract() {
    if (this.contract) {
      this.formDelivery.patchValue({
        supplyStreet: this.contract.address || '',
        supplyNumber: this.contract.streetNumber || '',
        supplyCity: this.contract.city || '',
        supplyPr: this.contract.province || '',
        supplyCap: this.contract.cap || '',
      });
    }
  }

  clearAddressFields() {
    this.formDelivery.patchValue({
      supplyStreet: '',
      supplyNumber: '',
      supplyCity: '',
      supplyPr: '',
      supplyCap: '',
    });
  }

  // Función para rellenar datos de prueba
  fillTestData() {
    this.formDelivery.patchValue({
      sameResidence: 'no',
      supplyStreet: 'Via Nazionale',
      supplyNumber: '456',
      supplyCity: 'Roma',
      supplyPr: 'RM',
      supplyCap: '00184',
      supplyPdrPod: 'IT001E12345678',
      currentPower: 3,
      powerRequired: 4.5,
      currentSupplier: 'Enel Energia',
      voltage: '220V',
      immediateActivation: false,
      activationDate: '01/12/2025',
    });
  }

  onSubmit() {
    this.formDelivery.markAllAsTouched();
    if (this.formDelivery.valid) {
      const formValue = this.formDelivery.value;

      const formattedData = {
        supplyStreet: formValue.supplyStreet,
        supplyNumber: formValue.supplyNumber,
        supplyCity: formValue.supplyCity,
        supplyPr: formValue.supplyPr,
        supplyCap: formValue.supplyCap,
        supplyPdrPod: formValue.supplyPdrPod,
        currentPower: formValue.currentPower || 0,
        powerRequired: formValue.powerRequired || 0,
        currentSupplier: formValue.currentSupplier,
        voltage: formValue.voltage || '',
        // immediateActivation: formValue.immediateActivation,
        activationDate: formValue.immediateActivation
          ? ''
          : formValue.activationDate,
      };

      this.save_data.emit({
        data: formattedData,
        step: 3,
      });
    } else {
      const firstInvalidControl = this.getFirstInvalidControl();
      if (firstInvalidControl) {
        firstInvalidControl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }

  private getFirstInvalidControl(): HTMLElement | null {
    const invalidControl = Object.keys(this.formDelivery.controls).find(
      (key) => this.formDelivery.get(key)?.invalid
    );
    if (invalidControl) {
      return document.querySelector(`[name="${invalidControl}"]`);
    }
    return null;
  }

  hasError(fieldName: string): boolean {
    const field = this.formDelivery.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.formDelivery.get(fieldName);
    if (field?.hasError('required')) {
      return 'Campo obbligatorio';
    }
    if (field?.hasError('pattern')) {
      return 'Formato non valido';
    }
    if (field?.hasError('maxlength')) {
      return 'Lunghezza non valida';
    }
    return '';
  }
}
