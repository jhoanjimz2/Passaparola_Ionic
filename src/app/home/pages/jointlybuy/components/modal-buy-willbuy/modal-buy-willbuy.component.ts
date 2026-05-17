import { Component, Input }                                          from '@angular/core';
import { ModalController, NavController }                            from '@ionic/angular';
import { Observable, Subscription }                                  from 'rxjs';
import { Willbuy }                                                   from 'src/app/shared/interfaces/jointlybuy/willbuy';
import { JointlybuyService }                                         from 'src/app/shared/services/jointlybuy.service';
import { IonContent, IonFooter, IonIcon, IonToolbar }                from "@ionic/angular/standalone";
import { FormattNumberPipe }                                         from 'src/app/shared/pipes';
import { SlidesPaymentMethodsComponent }                             from "../../../payments/components/slides-payment-methods/slides-payment-methods.component";
import { AddressCardDefaultComponent }                               from '../../../address/components/address-card-default/address-card-default.component';
import { Address }                                                   from 'src/app/shared/interfaces/address/address.interface';
import { PaymentSelection }                                          from 'src/app/shared/interfaces/payments/payment-selection.interface';
import { ToastrService }                                             from 'ngx-toastr';
import { TranslateService }                                          from '@ngx-translate/core';
import { StripeService, WalletService }                              from 'src/app/shared/services';
import { Operations }                                                from 'src/app/shared/interfaces/wallet/enum/operations.interfaces';
import { Reasons }                                                   from 'src/app/shared/interfaces/wallet/enum/reasons.interfaces';
import { environment }                                               from 'src/environments/environment';
import { Wallet }                                                    from 'src/app/shared/interfaces/wallet/wallet.interface';
import { NgxSpinnerService }                                         from 'ngx-spinner';
import { PaymentsService }                                           from 'src/app/shared/services/payments.service';
import { loadStripe }                                                from '@stripe/stripe-js';
import { CreatePaymentIntent }                                       from 'src/app/shared/interfaces/stripe/requets/create-payment-intent.interface';
import { TransferATMRequets }                                        from 'src/app/shared/interfaces/wallet/requets/transfer-atm-requets.interface';
import { MainWallets }                                               from 'src/app/shared/interfaces/wallet/main-wallets.interface';
import { CommonModule }                                              from '@angular/common';

@Component({
  selector: 'app-modal-buy-willbuy',
  templateUrl: './modal-buy-willbuy.component.html',
  styleUrls: ['./modal-buy-willbuy.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonContent,
    FormattNumberPipe,
    IonFooter,
    IonToolbar,
    AddressCardDefaultComponent,
    SlidesPaymentMethodsComponent,
    CommonModule
  ]
})
export class ModalBuyWillbuyComponent {
  @Input() id: string = '';

  willbuy: Willbuy = {} as Willbuy;
  address: Address | null = null;
  subscriptions: Subscription[] = [];
  quantity: number = 1;

  stripe: any;
  selectedPayment?: PaymentSelection;
  selectWallet: Wallet = {} as Wallet;
  mainWallets: MainWallets = {} as MainWallets;

  successPay: boolean = false;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private jointlybuyService: JointlybuyService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private walletService: WalletService,
    private stripeService: StripeService,
    private spinner: NgxSpinnerService,
    private paymentsService: PaymentsService
  ) {
    this.autoSubscribe(this.jointlybuyService.willbuy(), v => {
      this.willbuy = v;
    });
    this.autoSubscribe(this.paymentsService.mainWallets(), v => this.mainWallets = v);
    this.autoSubscribe(this.paymentsService.walletSelected(), v => this.selectWallet = v);
  }

  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripe.public_key);
  }

  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }

  ngAfterViewInit() {
    this.getDataWillbuy();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private getDataWillbuy(): void {
    if (this.id === this.willbuy.id) return;
    this.jointlybuyService.loadWillbuyForId(this.id).subscribe({
      next: () => {}
    });
  }

  getSoldUnits(): number {
    if (!this.willbuy.willbuyTransactions || this.willbuy.willbuyTransactions.length === 0) {
      return 0;
    }

    return this.willbuy.willbuyTransactions.reduce((total, transaction) => {
      return total + (transaction.quantity || 0);
    }, 0);
  }

  get getCurrentPhase() {
    if (!this.willbuy.purchaseDiscounts || this.willbuy.purchaseDiscounts.length === 0) {
      return null;
    }
    const sortedPhases = [...this.willbuy.purchaseDiscounts].sort((a, b) =>
      (a.minimumPurchaseUnits || 0) - (b.minimumPurchaseUnits || 0)
    );
    const soldUnits = this.getSoldUnits();
    const currentPhase = sortedPhases.find(phase =>
      soldUnits < (phase.minimumPurchaseUnits || 0)
    );
    return currentPhase || sortedPhases[sortedPhases.length - 1];
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getTotalPrice(): number {
    return +(this.getCurrentPhase?.total || 0) * this.quantity;
  }

  getTotalCashback(): number {
    return ((this.willbuy.product?.transferPercentages?.pointsPercentage ?? 0) / 100) * this.getTotalPrice();
  }

  cancel(): void {
    this.modalCtrl.dismiss();
  }

  onDefaultAddressSelected(address: Address) {
    this.address = address;
  }

  onPaymentSelected(selection: PaymentSelection): void {
    this.selectedPayment = selection;
  }

  canProceedWithPayment(): boolean {
    // Validar que haya al menos 1 producto
    const hasProduct = this.quantity >= 1;

    // Validar que haya una dirección válida
    const hasAddress = this.address !== null &&
                       this.address !== undefined &&
                       Object.keys(this.address).length > 0 &&
                       this.address.id !== undefined;

    // Validar que haya un método de pago seleccionado
    const hasPaymentMethod = this.selectedPayment !== undefined &&
                             this.selectedPayment !== null;

    return hasProduct && hasAddress && hasPaymentMethod;
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
      walletTo: environment.jointlybuy.walletPayWillbuy,
      amount: this.getTotalPrice(),
      isCash: false,
      typeOperation: Operations.transfer,
      status: 1,
      reason: Reasons.payment,
      observation: 'Payment willbuy',
      reasonStatusTransfer: Reasons.payment,
      rewardPercentage: this.willbuy.product?.transferPercentages?.rewardPercentage,
      cashBackPercentage: this.willbuy.product?.transferPercentages?.cashBackPercentage,
      helpPercentage: this.willbuy.product?.transferPercentages?.helpPercentage,
      drawingPercentage: this.willbuy.product?.transferPercentages?.drawingPercentage,
      communityPercentage: this.willbuy.product?.transferPercentages?.communityPercentage,
      pointsPercentage: this.willbuy.product?.transferPercentages?.pointsPercentage,
      isDigitalObject: true,
    }).subscribe({
      next: (response) => this.willbuyTransaction(response.id),
      error: () => this.toastr.error(this.translate.instant('WALLET.RECHARGE.ERROR_RECHARGE'))
    });
  }

  willbuyTransaction(id: string) {
    this.jointlybuyService.willbuyTransaction({
      observation: 'Payment willbuy',
      status: true,
      amount: this.getTotalPrice(),
      quantity: this.quantity,
      walletTransactionId: id,
      product: {
        id: this.willbuy.product?.id
      },
      willbuy: {
        id: this.willbuy.id
      },
      address: {
        id: this.address?.id
      }
    }).subscribe({
      next: () => {
        this.successPay = true;
      }
    })
  }

  createPaymentIntent() {
    if (this.selectedPayment?.type !== 'card') return;

    this.spinner.show();
    const amountInCents = Math.round(this.getTotalPrice() * 100);
    const createPaymentIntent: CreatePaymentIntent = {
      amount: amountInCents,
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
      amount: this.getTotalPrice(),
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


  back() {
    this.modalCtrl.dismiss();
    this.navCtrl.back()
  }

}
