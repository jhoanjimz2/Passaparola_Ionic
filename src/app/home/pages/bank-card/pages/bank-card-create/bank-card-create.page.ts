import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormControlName,
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

import { ModalController, NavController } from '@ionic/angular';

import { loadStripe } from '@stripe/stripe-js';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Observable, fromEvent, merge, debounceTime } from 'rxjs';

import { GenericValidator } from 'src/app/shared/validators/generic-validator';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { StripeService } from 'src/app/shared/services';
import { BankCardService } from 'src/app/shared/services/bank-card.service';

@Component({
  selector: 'app-bank-card-create',
  templateUrl: './bank-card-create.page.html',
  styleUrls: ['./bank-card-create.page.scss'],
})
export class BankCardCreatePage implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements!: ElementRef[];

  @ViewChild('owner') owner!: ElementRef;

  cardNumber: any;
  cardCvc: any;
  cardExpiry: any;
  displayMessage: any = {};
  form: FormGroup = {} as FormGroup;
  elements: any;
  stripe: any;
  validationMessages: any;
  user: User = {} as User;

  private genericValidator!: GenericValidator;

  constructor(
    private formBuild: FormBuilder,
    private spinner: NgxSpinnerService,
    private stripeService: StripeService,
    private bankCardService: BankCardService,
    private toastr: ToastrService,
    private navController: NavController,
    private translate: TranslateService
  ) {
    this.genericValidator = new GenericValidator();
  }

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('appPassaparola_user')!);

    this.initForm();

    this.stripe = await loadStripe(environment.stripe.public_key);

    this.createStripeElement();
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
      this.owner.nativeElement.focus();
    }, 500);
  }

  initForm() {
    this.validationMessages = {
      owner: {
        required: {
          message: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
          validator: [Validators.required],
        },
      },
      email: {
        required: {
          message: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
          validator: [Validators.required],
        },
        email: {
          message: this.translate.instant('ERROR_MESSAGE.EMAIL'),
          validator: [Validators.email],
        },
      },
      cardNumber: {
        required: {
          message: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
          validator: [Validators.required, Validators.requiredTrue],
        },
      },
      cardExpiry: {
        required: {
          message: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
          validator: [Validators.required, Validators.requiredTrue],
        },
      },
      cardCvc: {
        required: {
          message: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
          validator: [Validators.required, Validators.requiredTrue],
        },
      },
    };

    const formBuild: any = {};

    for (let field in this.validationMessages) {
      if (this.validationMessages.hasOwnProperty(field)) {
        const validations = this.validationMessages[field];
        let validators: any = [];

        for (let validation in validations) {
          if (validations.hasOwnProperty(validation))
            validators = [...validators, ...validations[validation].validator];
        }

        formBuild[field] = new FormControl('', validators);
      }
    }

    this.form = this.formBuild.group(formBuild);

    const email = this.user.email;
    this.form.get('email')?.setValue(email ? email : '');
  }

  private createStripeElement = () => {
    const style = {
      base: {
        color: '#111827',
        fontSize: '15px',
        '::placeholder': {
          color: '#cccccc',
        },
      },
      invalid: {
        color: '#f87171',
      },
    };

    this.elements = this.stripe.elements({
      fonts: [
        {
          cssSrc:
            'https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400&display=swap',
        },
      ],
    });

    const cardNumber = this.elements.create('cardNumber', {
      placeholder: '4242 4242 4242 4242',
      style,
      classes: {
        base: 'input-stripe-custom',
      },
    });

    const cardExpiry = this.elements.create('cardExpiry', {
      placeholder: 'MM/AA',
      style,
      classes: {
        base: 'input-stripe-custom',
      },
    });

    const cardCvc = this.elements.create('cardCvc', {
      placeholder: '000',
      style,
      classes: {
        base: 'input-stripe-custom',
      },
    });

    cardNumber.mount('#cardNumber');
    cardExpiry.mount('#cardExpiry');
    cardCvc.mount('#cardCvc');

    this.cardNumber = cardNumber;
    this.cardExpiry = cardExpiry;
    this.cardCvc = cardCvc;

    this.cardNumber.addEventListener(
      'change',
      this.onChangeCardNumber.bind(this)
    );
    this.cardExpiry.addEventListener(
      'change',
      this.onChangeCardExpiry.bind(this)
    );
    this.cardCvc.addEventListener('change', this.onChangeCardCvc.bind(this));
  };

  onChangeCardNumber({ error }: any) {
    this.form.patchValue({ cardNumber: !error });
  }

  onChangeCardCvc({ error }: any) {
    this.form.patchValue({ cardCvc: !error });
  }

  onChangeCardExpiry({ error }: any) {
    this.form.patchValue({ cardExpiry: !error });
  }

  async onSave() {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    const body: any = this.setAllValues();

    this.spinner.show();

    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.cardNumber,
      billing_details: {
        email: body.mail,
        name: body.owner,
        phone: `${this.user.country?.phonePrefix}${this.user.phoneNumber}`,
      },
    });

    if (error) {
      this.toastr.error('Non è stato possibile salvare le informazioni');
      this.spinner.hide();
      return;
    }

    this.stripeService
      .createCustomer({
        email: this.form.controls['email'].value,
        paymentMethodId: paymentMethod.id,
        name: body.owner,
      })
      .subscribe({
        next: (response) => {
          this.bankCardService.create({ idStripe: response.id }).subscribe({
            next: () => {
              this.toastr.success('Informazioni memorizzate correttamente');
              this.navController.navigateBack(['/pages/bank-card/list'], {
                queryParams: {},
              });
            },
            error: (error) => console.error(error),
            complete: () => {},
          });
        },
      });
  }

  setAllValues(): any {
    const body: any = {};

    for (const key in this.form.controls) {
      if (Object.prototype.hasOwnProperty.call(this.form.controls, key)) {
        body[key] = this.form.controls[key].value;
      }
    }

    return body;
  }
}
