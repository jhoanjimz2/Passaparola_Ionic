import { Component, Input, OnDestroy }                            from '@angular/core';
import { Product }                                                from 'src/app/shared/interfaces/events/events';
import { Wallet }                                                 from 'src/app/shared/interfaces/wallet/wallet.interface';
import { PaymentMethod }                                          from 'src/app/shared/interfaces/stripe/payment-method.interface';
import { EventsService, StripeService, WalletService }            from 'src/app/shared/services';
import { Subscription }                                           from 'rxjs';
import { NgxSpinnerService }                                      from 'ngx-spinner';
import { TranslateService }                                       from '@ngx-translate/core';
import { ToastrService }                                          from 'ngx-toastr';
import { CreatePaymentIntent }                                    from 'src/app/shared/interfaces/stripe/requets/create-payment-intent.interface';
import { TransferATMRequets }                                     from 'src/app/shared/interfaces/wallet/requets/transfer-atm-requets.interface';
import { Operations }                                             from 'src/app/shared/interfaces/wallet/enum/operations.interfaces';
import { Reasons }                                                from 'src/app/shared/interfaces/wallet/enum/reasons.interfaces';
import { MainWallets }                                            from 'src/app/shared/interfaces/wallet/main-wallets.interface';
import { MyEventsComponent }                                      from '../my-events/my-events.component';
import { ModalController }                                        from '@ionic/angular';
import { environment }                                            from 'src/environments/environment';
import { loadStripe }                                             from '@stripe/stripe-js';

@Component({
  selector: 'app-pay-ticket-extra',
  templateUrl: './pay-ticket-extra.component.html',
  styleUrls: ['./pay-ticket-extra.component.scss'],
})
export class PayTicketExtraComponent implements OnDestroy {
  @Input() product: Product = {} as Product;
  stripe: any;

  step: number = 1;
  cantidad: number = 1;

  selectTypePay: string = 'wallet';
  isViewed:boolean = false;
  selectWallet: Wallet = {} as Wallet;
  bankCards: PaymentMethod[] = [];
  selectPaymentMethod: PaymentMethod = {} as PaymentMethod;
  loading = false;
  subscription!: Subscription;
  subscription2!: Subscription;
  subscription3!: Subscription;
  transferRequets: TransferATMRequets = {} as TransferATMRequets;
  mainWallets: MainWallets = {} as MainWallets;

  constructor(
    private eventsService: EventsService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private walletService: WalletService,
    private stripeService: StripeService,
    private modalController: ModalController
  ) {
    this.subscription = this.eventsService.obtenerAllCardPayments().subscribe({
      next: (event) => { this.bankCards = structuredClone(event); }
    });
    this.subscription2 = this.eventsService.obtenerWalletSelect().subscribe({
      next: (event) => { this.selectWallet = structuredClone(event); }
    });
    this.subscription3 = this.eventsService.findMainWallets().subscribe({
      next: (response) => { this.mainWallets = structuredClone(response);  },
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.subscription2) this.subscription.unsubscribe();
    if (this.subscription3) this.subscription.unsubscribe();
  }
  async ngOnInit() {
    if(this.product.quantityAvailable === 0) {
      this.cantidad = 0;
    }
    this.stripe = await loadStripe(environment.stripe.public_key);
  }
  closeModal() {
    this.modalController.dismiss()
  }
  nextStep() {
    this.step+=1;
  }
  restar() {
    if ( this.cantidad > 1 ) {
      this.cantidad-=1;
    }
  }
  sumar() {
    if ( this.cantidad < this.product.quantityAvailable! ) {
      this.cantidad+=1;
    }
  }
  onSelectTypePay(ticket: string) {
    this.selectTypePay = ticket;
  }
  initPay() {
    if(this.selectTypePay != 'wallet') this.crearIntencionPago()
    else if(this.selectTypePay == 'wallet') this.pagoTicketsForWallet()
  }

  crearIntencionPago() {
    this.loading = true;
    const createPaymentIntent: CreatePaymentIntent = {
      amount: Math.round((this.cantidad * this.product.price) * 100),
      currency: 'eur',
      customerId: this.selectPaymentMethod?.data[0].customer!,
      paymentMethod: this.selectPaymentMethod?.data[0].id!,
    };
    this.stripeService.createPaymentIntent(createPaymentIntent).subscribe({
      next: async (response) => {
        setTimeout(() => this.spinner.show(), 150);
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
  transferAtm() {
    this.transferRequets = {
      walletFrom: this.mainWallets.recharge.id!,
      walletTo: this.selectWallet.id!,
      amount: Math.round((this.cantidad * this.product.price) * 100),
      typeOperation: Operations.recharge,
      status: 1,
      reason: Reasons.send,
      observation: '',
      reasonStatusTransfer: Reasons.send,
      transactionType: 'receive',
    };
    this.walletService.transferATM(this.transferRequets).subscribe({
      next: (response) => this.pagoTicketsForWallet(),
      error: () => {
        this.toastr.error(this.translate.instant('WALLET.RECHARGE.ERROR_RECHARGE'));
        this.loading = false;
      },
    });
  }
  pagoTicketsForWallet() {
    this.eventsService.payForWallet({
      id: this.product.id!,
      walletFrom: this.selectWallet.id!,
      quantity: this.cantidad
    }).subscribe({
      next: () => {
        this.nextStep();
      }
    })
  }
  openModalMyTicket() {
    this.closeModal();
    this.openMyEvents();
  }
  async openMyEvents() {
    const modal = await this.modalController.create({
      component: MyEventsComponent,
    });
    modal.present();
  }

}
