import { CommonModule }                                from '@angular/common';
import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController }                from '@ionic/angular';

import { TranslateModule, TranslateService }           from '@ngx-translate/core';
import { Observable,                                   fromEvent, merge, debounceTime } from 'rxjs';
import { ComponentModule }                             from 'src/app/components/component.module';

import { Country }                                     from 'src/app/shared/interfaces/country/country.interface';
import { CountryService }                              from 'src/app/shared/services';
import { SessionService }                              from 'src/app/shared/services/session.service';
import { GenericValidator }                            from 'src/app/shared/validators/generic-validator';
import { PasswordMatcher }                             from 'src/app/shared/validators/password-matcher';

@Component({
  selector: 'app-seat-contact',
  templateUrl: './seat-contact.component.html',
  styleUrls: ['./seat-contact.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    CommonModule,
    ComponentModule,
  ],
})
export class SeatContactComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  displayMessage: any = {};
  countries: Country[] = [];
  form: FormGroup = {} as FormGroup;
  validationMessages: any;
  idCountry: string = '';

  private genericValidator!: GenericValidator;

  constructor(
    private modalController: ModalController,
    private countryService: CountryService,
    private translate: TranslateService,
    private formBuild: FormBuilder,
    public sessionService: SessionService
  ) {
    this.genericValidator = new GenericValidator();
  }

  async ngOnInit() {
    this.initForm();
    this.getCountries();
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    merge(this.form.valueChanges, ...controlBlurs)
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.checksValidations();
      });
  }

  async onSave() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.checksValidations();
      return;
    }

    this.getCountryCode(this.form.get('countryCode')?.value);
    this.modalController.dismiss({
      countryCode: this.form.get('countryCode')?.value,
      phone: this.form.get('phone')?.value.toString(),
      pin: this.form.get('pin')?.value,
      country: { id: this.idCountry },
    });
  }

  private initForm() {
    this.validationMessages = {
      countryCode: {
        required: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
      },
      phone: {
        required: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
        pattern: this.translate.instant('ERROR_MESSAGE.MIN_LENGTH', {
          value: 7,
        }),
      },
      pin: {
        required: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
        pattern: this.translate.instant('ERROR_MESSAGE.PIN_MIN_LENGTH', {
          value: 5,
        }),
        match: 'Pin does not match',
      },
      repeatPin: {
        required: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
        pattern: this.translate.instant('ERROR_MESSAGE.PIN_MIN_LENGTH', {
          value: 5,
        }),
        match: 'Pin does not match',
      },
    };

    this.form = this.formBuild.group(
      {
        countryCode: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/^\d{7,}$/)]],
        pin: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        repeatPin: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      },
      { validator: PasswordMatcher.match('pin', 'repeatPin') }
    );
  }

  private checksValidations() {
    this.displayMessage = this.genericValidator.processMessages(
      this.form,
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
