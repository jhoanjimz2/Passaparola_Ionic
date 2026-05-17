import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import {
  FormControlName,
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, fromEvent, merge, debounceTime } from 'rxjs';
import { ComponentModule } from 'src/app/components/component.module';
import { Country } from 'src/app/shared/interfaces/country/country.interface';
import { GenericValidator } from 'src/app/shared/validators/generic-validator';
import { PasswordMatcher } from 'src/app/shared/validators/password-matcher';

@Component({
  selector: 'app-seat-security-pin',
  templateUrl: './seat-security-pin.component.html',
  styleUrls: ['./seat-security-pin.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    ComponentModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class SeatSecurityPinComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  displayMessage: any = {};
  countries: Country[] = [];
  form: FormGroup = {} as FormGroup;
  validationMessages: any;

  private genericValidator!: GenericValidator;

  constructor(
    private modalController: ModalController,
    private translate: TranslateService,
    private formBuild: FormBuilder
  ) {
    this.genericValidator = new GenericValidator();
  }

  async ngOnInit() {
    this.initForm();
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

  async onSavePin() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.checksValidations();
      return;
    }

    this.modalController.dismiss({
      pin: this.form.get('pin')?.value,
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
}
