import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { loadStripe } from '@stripe/stripe-js';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/shared/interfaces/user/user.interface';

import { StripeService } from 'src/app/shared/services';
import { BankCardService } from 'src/app/shared/services/bank-card.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-payment-method',
  templateUrl: './add-payment-method.component.html',
  styleUrls: ['./add-payment-method.component.scss'],
})
export class AddPaymentMethodComponent implements OnInit {
  stripe: any;
  elements: any;
  cardNumber: any;
  cardCvv: any;
  cardExp: any;
  formCard: FormGroup = new FormGroup({});
  user: User = {} as User;

  constructor(
    private formBuild: FormBuilder,
    private stripeService: StripeService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService,
    public modalController: ModalController,
    private bankCardService: BankCardService
  ) {}

  async ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('appPassaparola_user')!);
    this.buildFormcard();
    this.stripe = await loadStripe(environment.stripe.public_key);
    this.createStripeElement();
  }

  buildFormcard() {
    const email = this.user.email;
    this.formCard = this.formBuild.group({
      name: ['', [Validators.required, Validators.required]],
      email: [
        email ? email : '',
        [Validators.required, Validators.required, Validators.email],
      ],
      saveCard: [false, []],
      cardNumber: [false, [Validators.required, Validators.requiredTrue]],
      cardExp: [false, [Validators.required, Validators.requiredTrue]],
      cardCvv: [false, [Validators.required, Validators.requiredTrue]],
    });
  }

  private createStripeElement = () => {
    const style = {
      base: {
        color: '#000000',
        fontSize: '14px',
        '::placeholder': {
          color: '#cccccc',
        },
        border: '1px solid red',
      },
      invalid: {
        color: '#dc3545',
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
    const cardExp = this.elements.create('cardExpiry', {
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

    cardNumber.mount('#card');
    cardExp.mount('#exp');
    cardCvc.mount('#cvc');

    this.cardNumber = cardNumber;
    this.cardExp = cardExp;
    this.cardCvv = cardCvc;

    this.cardNumber.addEventListener('change', this.onChangeCard.bind(this));
    this.cardExp.addEventListener('change', this.onChangeExp.bind(this));
    this.cardCvv.addEventListener('change', this.onChangeCvv.bind(this));
  };

  onChangeCard({ error }: any) {
    this.formCard.patchValue({ cardNumber: !error });
  }

  onChangeCvv({ error }: any) {
    this.formCard.patchValue({ cardCvv: !error });
  }

  onChangeExp({ error }: any) {
    this.formCard.patchValue({ cardExp: !error });
  }

  async createPaymentMewthod() {
    this.spinner.show();
    const { paymentMethod, error } = await this.stripe.createPaymentMethod({
      type: 'card',
      card: this.cardNumber,
      billing_details: {
        email: this.formCard.controls['email'].value,
        name: this.formCard.controls['name'].value,
        phone: `${this.user.country?.phonePrefix}${this.user.phoneNumber}`,
      },
    });

    if (error) {
      this.toastr.error(
        this.translate.instant('WALLET.RECHARGE.ERROR_ADD_CARD')
      );
      this.spinner.hide();
      return;
    }

    this.stripeService
      .createCustomer({
        email: this.formCard.controls['email'].value,
        name: this.formCard.controls['name'].value,
        paymentMethodId: paymentMethod.id,
      })
      .subscribe({
        next: (response) => {
          if (!this.formCard.controls['saveCard'].value) {
            this.toastr.success(
              this.translate.instant('WALLET.RECHARGE.ADD_CARD_SUCCESFULLY')
            );
            this.modalController.dismiss({ customer: response });
            return;
          }

          this.bankCardService.create({ idStripe: response.id }).subscribe({
            next: () => {
              this.toastr.success(
                this.translate.instant('WALLET.RECHARGE.ADD_CARD_SUCCESFULLY')
              );
              this.modalController.dismiss({ customer: response });
            },
            error: (error) => console.error(error),
            complete: () => {},
          });
        },
      });
  }
}
