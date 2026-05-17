import { Component, Input }                                           from '@angular/core';
import { IonContent, IonGrid, IonRow, IonCol, IonFooter, IonToolbar } from '@ionic/angular/standalone';
import { Observable, Subscription }                                   from 'rxjs';
import { Wallet }                                                     from 'src/app/shared/interfaces/wallet/wallet.interface';
import { CommonModule }                                               from '@angular/common';
import { FormattNumberPipe }                                          from 'src/app/shared/pipes';
import { ModalController }                                            from '@ionic/angular';
import { StripeService, WalletService }                               from 'src/app/shared/services';
import { Operations }                                                 from 'src/app/shared/interfaces/wallet/enum/operations.interfaces';
import { Reasons }                                                    from 'src/app/shared/interfaces/wallet/enum/reasons.interfaces';
import { environment }                                                from 'src/environments/environment';
import { TranslateService }                                           from '@ngx-translate/core';
import { ToastrService }                                              from 'ngx-toastr';
import { CreatePaymentIntent }                                        from 'src/app/shared/interfaces/stripe/requets/create-payment-intent.interface';
import { NgxSpinnerService }                                          from 'ngx-spinner';
import { loadStripe }                                                 from '@stripe/stripe-js';
import { TransferATMRequets }                                         from 'src/app/shared/interfaces/wallet/requets/transfer-atm-requets.interface';
import { MainWallets }                                                from 'src/app/shared/interfaces/wallet/main-wallets.interface';
import { PaymentSelection }                                           from 'src/app/shared/interfaces/payments/payment-selection.interface';
import { SlidesPaymentMethodsComponent }                              from 'src/app/home/pages/payments/components/slides-payment-methods/slides-payment-methods.component';
import { PaymentsService }                                            from 'src/app/shared/services/payments.service';
import { Address }                                                    from 'src/app/shared/interfaces/address/address.interface';
import { AddressCardDefaultComponent }                                from 'src/app/home/pages/address/components/address-card-default/address-card-default.component';

@Component({
  selector: 'app-pay-wishbuy',
  templateUrl: './pay-wishbuy.component.html',
  styleUrls: ['./pay-wishbuy.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    CommonModule,
    FormattNumberPipe,
    SlidesPaymentMethodsComponent,
    IonFooter,
    IonToolbar,
    AddressCardDefaultComponent
  ]
})
export class PayWishbuyComponent {
  @Input() priceNumber: number = 0;
  @Input() purchasedNumber: number = 0;

  stripe: any;
  subscriptions: Subscription[] = [];
  mainWallets: MainWallets = {} as MainWallets;
  selectedPayment?: PaymentSelection;
  selectWallet: Wallet = {} as Wallet;
  address: Address = {} as Address;

  constructor(
    private modalCtrl: ModalController,
    private walletService: WalletService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private stripeService: StripeService,
    private spinner: NgxSpinnerService,
    private paymentsService: PaymentsService
  ) {
    this.autoSubscribe(this.paymentsService.mainWallets(), v => this.mainWallets = v);
    this.autoSubscribe(this.paymentsService.walletSelected(), v => this.selectWallet = v);
  }

  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripe.public_key);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void): void {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }

  onPaymentSelected(selection: PaymentSelection): void {
    this.selectedPayment = selection;
  }

  onDefaultAddressSelected(address: Address) {
    this.address = address;
  }

  initPay() {
    if (!this.selectedPayment) {
      this.toastr.warning(this.translate.instant('WALLET.SELECT_PAYMENT_METHOD'));
      return;
    }
    if (this.selectedPayment.type === 'wallet') {
      this.payForWallet();
    } else {
      this.createPaymentIntent();
    }
  }

  payForWallet() {
    this.walletService.transferATM({
      transactionType: 'send',
      walletFrom: this.selectWallet.id!,
      walletTo: environment.jointlybuy.walletPayJoyer,
      amount: this.priceNumber,
      isCash: false,
      typeOperation: Operations.transfer,
      status: 1,
      reason: Reasons.payment,
      observation: 'Payment wishbuy',
      reasonStatusTransfer: Reasons.payment,
      rewardPercentage: 12,
      cashBackPercentage: 0.60,
      helpPercentage: 0.30,
      drawingPercentage: 0.30,
      communityPercentage: 3,
      pointsPercentage: 7.80,
      isDigitalObject: true,
    }).subscribe({
      next: (response) => this.modalCtrl.dismiss(
        {
          success: true,
          walletTransactionId: response.id,
          addressId: this.address.id
        }
      ),
      error: () => this.toastr.error(this.translate.instant('WALLET.RECHARGE.ERROR_RECHARGE'))
    });
  }

  createPaymentIntent() {
    if (this.selectedPayment?.type !== 'card') return;

    this.spinner.show();
    const createPaymentIntent: CreatePaymentIntent = {
      amount: this.priceNumber * 100,
      currency: 'eur',
      customerId: this.selectedPayment.card.customer,
      paymentMethod: this.selectedPayment.card.id,
    };

    this.stripeService.createPaymentIntent(createPaymentIntent).subscribe({
      next: async (response) => {
        setTimeout(() => this.spinner.show(), 150);
        const { error: confirmError } = await this.stripe.confirmCardPayment(
          response.client_secret
        );
        if (confirmError) {
          this.toastr.error(this.translate.instant('WALLET.RECHARGE.ERROR_PAYMENT'));
          this.spinner.hide();
          return;
        }
        this.transferAtm();
      },
      error: () => {
        this.spinner.hide();
        this.toastr.error(this.translate.instant('WALLET.RECHARGE.ERROR_PAYMENT'));
      }
    });
  }

  transferAtm() {
    const transferRequets: TransferATMRequets = {
      walletFrom: this.mainWallets.recharge.id!,
      walletTo: this.selectWallet.id!,
      amount: this.priceNumber,
      typeOperation: Operations.recharge,
      status: 1,
      reason: Reasons.send,
      observation: '',
      reasonStatusTransfer: Reasons.send,
      transactionType: 'receive',
    };

    this.walletService.transferATM(transferRequets).subscribe({
      next: () => this.payForWallet(),
      error: () => {
        this.spinner.hide();
        this.toastr.error(this.translate.instant('WALLET.RECHARGE.ERROR_RECHARGE'));
      },
    });
  }

}
