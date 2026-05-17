import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { loadStripe } from '@stripe/stripe-js';

import { PaymentMethod } from 'src/app/shared/interfaces/stripe/payment-method.interface';
import { CreatePaymentIntent } from 'src/app/shared/interfaces/stripe/requets/create-payment-intent.interface';

import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import { StripeService, WalletService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { MainWallets } from 'src/app/shared/interfaces/wallet/main-wallets.interface';
import { TransferATMRequets } from 'src/app/shared/interfaces/wallet/requets/transfer-atm-requets.interface';
import { Reasons } from 'src/app/shared/interfaces/wallet/enum/reasons.interfaces';
import { Operations } from 'src/app/shared/interfaces/wallet/enum/operations.interfaces';
import { RechargeSuccesfullyComponent } from '../recharge-succesfully/recharge-succesfully.component';
import { BankCardService } from 'src/app/shared/services/bank-card.service';
import { IResponseBankCard } from 'src/app/shared/interfaces/bank-card/bank-card.interface';
import { AddPaymentMethodComponent } from '../add-payment-method/add-payment-method.component';
import { GatewayService } from 'src/app/shared/services/gateway.service';
import { RechargeInGateway } from 'src/app/shared/interfaces/gateway/requets/recharge.interface';

interface Action {
  icon: string;
  title: string;
  index: number;
}

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.scss'],
})
export class RechargeComponent implements OnInit {
  stripe: any;
  @Input() wallet: Wallet = {} as Wallet;
  formWithdraw: FormGroup = {} as FormGroup;
  amounts: number[] = [100.0, 150.0, 250.0, 500.0];
  options: Action[] = [
    {
      icon: 'cash-outline',
      title: 'WALLET.MODAL_WITHDRAW.BACK_TRANSFER',
      index: 1,
    },
    {
      icon: 'cash-outline',
      title: 'WALLET.MODAL_WITHDRAW.ATM_PASSAPAROLA',
      index: 2,
    },
    {
      icon: 'cash-outline',
      title: 'WALLET.MODAL_WITHDRAW.PASSAPAROLA_CASH',
      index: 3,
    },
  ];
  optionActive = 0;
  paymentMethods: PaymentMethod[] = [];
  paymentMethod: PaymentMethod | undefined;
  loading = false;
  indexPayment = 0;
  mainWallets: MainWallets = {} as MainWallets;
  transferRequets: TransferATMRequets = {} as TransferATMRequets;

  constructor(
    private formBuild: FormBuilder,
    private stripeService: StripeService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private modalController: ModalController,
    private walletService: WalletService,
    private bankCardService: BankCardService,
    private gatewayService: GatewayService
  ) {}

  async ngOnInit() {
    this.buildForm();
    this.getPaymentMethods();
    this.getMainWallets();
    this.stripe = await loadStripe(environment.stripe.public_key);
  }

  buildForm() {
    this.formWithdraw = this.formBuild.group({
      amount: new FormControl(0, [Validators.required, Validators.min(0.1)]),
    });
  }

  focus() {
    if (this.formWithdraw.controls['amount'].value === 0)
      this.formWithdraw.controls['amount'].setValue('');
  }

  losesFocus() {
    if (this.formWithdraw.controls['amount'].value === '')
      this.formWithdraw.controls['amount'].setValue(0);
  }

  setAmount(amount: number) {
    this.formWithdraw.controls['amount'].setValue(amount);
  }

  getMainWallets() {
    this.walletService.findMainWallets().subscribe({
      next: (response) => (this.mainWallets = response),
    });
  }

  recharge() {
    this.loading = true;
    this.formWithdraw.controls['amount'].setValue(
      +this.formWithdraw.controls['amount'].value
    );
    const createPaymentIntent: CreatePaymentIntent = {
      amount: this.formWithdraw.controls['amount'].value * 100,
      currency: 'eur',
      customerId: this.paymentMethod?.data[0].customer!,
      paymentMethod: this.paymentMethod?.data[0].id!,
    };

    this.stripeService.createPaymentIntent(createPaymentIntent).subscribe({
      next: async (response) => {
        setTimeout(() => {
          this.spinner.show();
        }, 150);
        const { error: confirmError } = await this.stripe.confirmCardPayment(
          response.client_secret
        );
        if (confirmError) {
          this.translate.instant('WALLET.RECHARGE.ERROR_PAYMENT');
          this.spinner.hide();
          this.loading = false;
          return;
        }
        this.transferAtm();
      },
    });
  }

  async modalOptionsRecharge() {
    const modal = await this.modalController.create({
      component: AddPaymentMethodComponent,
      cssClass: 'modal-100vh',
      backdropDismiss: true,
      componentProps: { wallet: this.wallet },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (!data) return;
    const customer = data.customer;
    this.stripeService.getPaymentMethod(customer.id).subscribe({
      next: (response) => {
        this.paymentMethods.push(response);
      },
    });
  }

  transferAtm() {
    this.transferRequets = {
      walletFrom: this.mainWallets.recharge.id!,
      walletTo: this.wallet.id!,
      amount: this.formWithdraw.controls['amount'].value,
      typeOperation: Operations.recharge,
      status: 1,
      reason: Reasons.send,
      observation: '',
      reasonStatusTransfer: Reasons.send,
      transactionType: 'receive',
    };
    this.walletService.transferATM(this.transferRequets).subscribe({
      next: (response) => {
        this.modalController.dismiss();
        const arrayId = response.id.split('-');
        const idTransaction = arrayId[arrayId.length - 1];
        this.getWalletById();
        this.transferSuccessfully(idTransaction);
      },
      error: () => {
        this.toastr.error(
          this.translate.instant('WALLET.RECHARGE.ERROR_RECHARGE')
        );
        this.loading = false;
      },
    });
  }

  rechargeGateway() {
    const requets: RechargeInGateway = {
      amount: this.formWithdraw.controls['amount'].value,
      description: 'Recharge',
      idStripe: this.paymentMethod?.data[0].customer!,
      payment_method: this.paymentMethod?.data[0].id!,
      walletCode: this.wallet.id!,
    };

    this.gatewayService.recharge(requets).subscribe({
      next: (response) => {
        this.modalController.dismiss();
        // const arrayId = response.id.split('-');
        // const idTransaction = arrayId[arrayId.length - 1];
        this.getWalletById();
        this.transferSuccessfully('idTransaction');
      },
      error: () => {
        this.toastr.error(
          this.translate.instant('WALLET.RECHARGE.ERROR_RECHARGE')
        );
        this.loading = false;
      },
    });
  }

  async transferSuccessfully(idTransaction: string) {
    const modal = await this.modalController.create({
      component: RechargeSuccesfullyComponent,
      backdropDismiss: true,
      componentProps: {
        amount: this.formWithdraw.controls['amount'].value,
        idTransaction,
        paymentMethod: this.paymentMethod,
      },
      cssClass: 'modal-full-screen',
    });
    await modal.present();
  }

  getWalletById() {
    this.walletService.findWalletById(this.wallet.id!).subscribe({
      next: (response) => {
        this.walletService.myWalletSet(response);
      },
    });
  }

  getPaymentMethods() {
    this.bankCardService
      .findAll({
        filterUser: true,
        offset: 1,
        limit: 1000,
      })
      .subscribe(({ data }: IResponseBankCard) => {
        const customerIds: string[] = data.map((card) => {
          return card.idStripe;
        });

        this.stripeService.getPaymentMethods(customerIds).subscribe({
          next: (response) => {
            this.paymentMethods = response;
          },
        });
      });
  }
}
