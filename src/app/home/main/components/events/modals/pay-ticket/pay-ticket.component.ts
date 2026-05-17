import { Component, OnDestroy }                        from '@angular/core';
import { ModalController }                             from '@ionic/angular';
import { Subscription }                                from 'rxjs';
import { MyEventsComponent }                           from '../my-events/my-events.component';
import { EventsService, StripeService, WalletService } from 'src/app/shared/services';
import { Events, Ticket }                              from 'src/app/shared/interfaces/events/events';
import { Wallet }                                      from 'src/app/shared/interfaces/wallet/wallet.interface';
import { CreatePaymentIntent }                         from 'src/app/shared/interfaces/stripe/requets/create-payment-intent.interface';
import { NgxSpinnerService }                           from 'ngx-spinner';
import { TranslateService }                            from '@ngx-translate/core';
import { environment }                                 from 'src/environments/environment';
import { loadStripe }                                  from '@stripe/stripe-js';
import { PaymentMethod }                               from 'src/app/shared/interfaces/stripe/payment-method.interface';
import { TransferATMRequets }                          from 'src/app/shared/interfaces/wallet/requets/transfer-atm-requets.interface';
import { ToastrService }                               from 'ngx-toastr';
import { Operations }                                  from 'src/app/shared/interfaces/wallet/enum/operations.interfaces';
import { Reasons }                                     from 'src/app/shared/interfaces/wallet/enum/reasons.interfaces';
import { MainWallets }                                 from 'src/app/shared/interfaces/wallet/main-wallets.interface';

@Component({
  selector: 'app-pay-ticket',
  templateUrl: './pay-ticket.component.html',
  styleUrls: ['./pay-ticket.component.scss'],
})
export class PayTicketComponent  implements OnDestroy {
  stripe: any;

  bankCards: PaymentMethod[] = [];

  selectTicket: Ticket = {} as Ticket;
  selectPaymentMethod: PaymentMethod = {} as PaymentMethod;
  selectWallet: Wallet = {} as Wallet;
  isViewed:boolean = false;

  selectTypePay: string = 'wallet';

  step: number = 1;

  eventProfile: Events = {} as Events;
  private subscription!: Subscription;
  private subscription2!: Subscription;
  private subscription3!: Subscription;
  private subscription4!: Subscription;

  transferRequets: TransferATMRequets = {} as TransferATMRequets;
  mainWallets: MainWallets = {} as MainWallets;
  loading = false;
  cantidad: number = 1;

  constructor(
    private modalController: ModalController,
    private eventsService: EventsService,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private stripeService: StripeService,
    private walletService: WalletService
  ) {
    this.subscription = this.eventsService.obtenerEventSelect().subscribe({
      next: (event) => { this.eventProfile = structuredClone(event); }
    });
    this.subscription2 = this.eventsService.obtenerWalletSelect().subscribe({
      next: (event) => { this.selectWallet = structuredClone(event); }
    });
    this.subscription3 = this.eventsService.obtenerAllCardPayments().subscribe({
      next: (event) => { this.bankCards = structuredClone(event); }
    });
    this.subscription4 = this.eventsService.findMainWallets().subscribe({
      next: (response) => { this.mainWallets = structuredClone(response);  },
    });
  }

  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripe.public_key);
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
    if (this.subscription3) this.subscription3.unsubscribe();
    if (this.subscription4) this.subscription4.unsubscribe();
  }

  onSelectTicket(ticket: Ticket) {
    if (ticket.quantityAvailable === 0) {
      this.cantidad = 0;
      return
    }
    this.selectTicket = ticket;
  }
  onSelectTypePay(ticket: string) {
    this.selectTypePay = ticket;
  }
  closeModal() {
    this.modalController.dismiss()
  }
  nextStep() {
    this.step+=1;
  }
  backStep() {
    this.step-=1;
    this.cantidad = 1;
  }
  restar() {
    if ( this.cantidad > 1 ) {
      this.cantidad-=1;
    }
  }
  sumar() {
    if ( this.cantidad < this.selectTicket.quantityAvailable! ) {
      this.cantidad+=1;
    }
  }






  initPay() {
    if(this.selectTypePay != 'wallet') this.crearIntencionPago()
    else if(this.selectTypePay == 'wallet') this.pagoTicketsForWallet()
  }

  crearIntencionPago() {
    this.loading = true;
    const createPaymentIntent: CreatePaymentIntent = {
      amount: Math.round((this.cantidad * this.selectTicket.price) * 100),
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
      amount: Math.round((this.cantidad * this.selectTicket.price) * 100),
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
      id: this.selectTicket.id!,
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
