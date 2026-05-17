import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { Observable, fromEvent, merge, debounceTime } from 'rxjs';

import { GenericValidator } from 'src/app/shared/validators/generic-validator';

import { CountryService } from 'src/app/shared/services';
import { Country } from 'src/app/shared/interfaces/country/country.interface';
import { BankAccountService } from 'src/app/shared/services/bank-account.service';
import { IBankAccount } from 'src/app/shared/interfaces/bank-account/bank-account.interface';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-bank-account-create',
  templateUrl: './bank-account-create.page.html',
  styleUrls: ['./bank-account-create.page.scss'],
})
export class BankAccountCreatePage implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  @ViewChild('bankName') bankName!: ElementRef;

  countries: Country[] = [];
  displayMessage: any = {};
  form: FormGroup = {} as FormGroup;
  validationMessages: any;

  private genericValidator!: GenericValidator;

  constructor(
    private formBuild: FormBuilder,
    private countryService: CountryService,
    private navController: NavController,
    private translate: TranslateService,
    private bankAccountService: BankAccountService
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
        this.displayMessage = this.genericValidator.processMessages(
          this.form,
          this.validationMessages
        );
      });

    setTimeout(() => {
      this.bankName.nativeElement.focus();
    }, 500);
  }

  initForm() {
    this.validationMessages = {
      bankName: {
        required: {
          message: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
          validator: Validators.required,
        },
      },
      owner: {
        required: {
          message: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
          validator: Validators.required,
        },
      },
      accountNumber: {
        required: {
          message: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
          validator: Validators.required,
        },
      },
      country: {
        required: {
          message: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
          validator: Validators.required,
        },
      },
      code: {},
    };

    const formBuild: any = {};

    for (let field in this.validationMessages) {
      if (this.validationMessages.hasOwnProperty(field)) {
        const validations = this.validationMessages[field];
        const validators: any = [];

        for (let validation in validations) {
          if (validations.hasOwnProperty(validation))
            validators.push(validations[validation].validator);
        }

        formBuild[field] = new FormControl('', validators);
      }
    }

    this.form = this.formBuild.group(formBuild);
  }

  getCountries() {
    this.countryService.findAll().subscribe({
      next: (response) => {
        this.countries = response;
      },
    });
  }

  onSave() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    const body: IBankAccount = this.setAllValues();

    this.bankAccountService.create(body).subscribe({
      next: () => {
        this.navController.navigateRoot(['pages/bank-account'], {
          queryParams: {},
        });
      },
      error: (error) => console.error(error),
      complete: () => {},
    });
  }

  setAllValues(): IBankAccount {
    const body: any = {};

    for (const key in this.form.controls) {
      if (Object.prototype.hasOwnProperty.call(this.form.controls, key)) {
        body[key] = this.form.controls[key].value;
      }
    }

    body.country = this.countries.find(
      (country) => country.id === body.country
    );

    return body;
  }
}
