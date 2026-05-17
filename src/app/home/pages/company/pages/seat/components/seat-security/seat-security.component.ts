import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, fromEvent, merge, debounceTime } from 'rxjs';
import { ConfirmationPinComponent } from 'src/app/components/confirmation-pin/confirmation-pin.component';
import { Country } from 'src/app/shared/interfaces/country/country.interface';
import { CountryService } from 'src/app/shared/services';
import { SeatService } from 'src/app/shared/services/seat.service';
import { GenericValidator } from 'src/app/shared/validators/generic-validator';
import { SeatSecurityPinComponent } from '../seat-security-pin/seat-security-pin.component';
import { ToastrService } from 'ngx-toastr';
import { ComponentModule } from 'src/app/components/component.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seat-security',
  templateUrl: './seat-security.component.html',
  styleUrls: ['./seat-security.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    ComponentModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class SeatSecurityComponent implements OnInit {
  @Input() seat: any = {};

  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  displayMessage: any = {};
  countries: Country[] = [];
  formPhone: FormGroup = {} as FormGroup;
  formPin: FormGroup = {} as FormGroup;
  validationMessages: any;

  private genericValidator!: GenericValidator;

  idCountry: string = '';

  constructor(
    private modalController: ModalController,
    private countryService: CountryService,
    private seatService: SeatService,
    private formBuild: FormBuilder,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this.genericValidator = new GenericValidator();
  }

  async ngOnInit() {
    this.getCountries();
    this.initForm();
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    merge(this.formPhone.valueChanges, ...controlBlurs)
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.checksValidations();
      });
  }

  update(payload: any, pin?: string) {
    delete payload.updatedAt;
    delete payload.id;
    if (pin) delete payload.pin;
    delete payload.createdAt;

    this.seatService.update(this.seat.id, payload).subscribe({
      next: (response) => {
        this.seat = response;
        this.toastr.success(this.translate.instant('SEAT.INFO_UPDATED'));
      },
    });
  }

  async onSavePhone() {
    if (!this.formPhone.valid) {
      this.formPhone.markAllAsTouched();
      this.checksValidations();
      return;
    }

    const modal = await this.modalController.create({
      component: ConfirmationPinComponent,
      backdropDismiss: true,
      componentProps: { isCompany: true },
      cssClass: 'modal-95vh',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data.pin) {
      this.getCountryCode(this.formPhone.get('countryCode')?.value);
      this.update({
        countryCode: this.formPhone.get('countryCode')?.value,
        phone: this.formPhone.get('phone')?.value.toString(),
        country: { id: this.idCountry },
      });
    }
  }

  async onSavePin() {
    const modal = await this.modalController.create({
      component: ConfirmationPinComponent,
      backdropDismiss: true,
      componentProps: { isCompany: true },
      cssClass: 'modal-95vh',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data.pin) this.onOpenModalSeatSecurityPin();
  }

  async onOpenModalSeatSecurityPin() {
    const modal = await this.modalController.create({
      component: SeatSecurityPinComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: {},
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data.pin)
      this.update({
        pin: data.pin,
      });
  }

  private initForm() {
    this.validationMessages = {
      pin: {
        required: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
        pattern: this.translate.instant('ERROR_MESSAGE.PIN_MIN_LENGTH', {
          value: 5,
        }),
        match: 'Pin does not match',
      },
    };

    this.formPhone = this.formBuild.group({
      countryCode: [this.seat.countryCode, [Validators.required]],
      phone: [
        this.seat.phone,
        [Validators.required, Validators.pattern(/^\d{7,}$/)],
      ],
    });

    this.formPin = this.formBuild.group({
      pin: ['12345', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    });
  }

  private checksValidations() {
    this.displayMessage = this.genericValidator.processMessages(
      this.formPhone,
      this.validationMessages
    );
  }

  private getCountries() {
    this.countryService.findAll().subscribe({
      next: (response) => {
        this.countries = response;
      },
      error: (error) => console.error(error),
      complete: () => {},
    });
  }

  getCountryCode(countryCode: string) {
    const contry = this.countries.find((data) => data.code === countryCode);
    this.idCountry = contry ? contry.id : '';
  }
}
