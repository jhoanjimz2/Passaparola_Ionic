import { CommonModule }                                                                                                    from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, OnDestroy, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable, Subscription }                                                                                        from 'rxjs';
import { NavController, ModalController }                                                                                  from '@ionic/angular';
import { Wallet }                                                                                                          from 'src/app/shared/interfaces/wallet/wallet.interface';
import { BankCard, PaymentSelection }                                                                                      from 'src/app/shared/interfaces/payments/payment-selection.interface';
import { PaymentsService }                                                                                                 from 'src/app/shared/services/payments.service';
import { PaymentMethodWalletComponent }                                                                                    from "../payment-method-wallet/payment-method-wallet.component";
import { PaymentMethodCardComponent }                                                                                      from "../payment-method-card/payment-method-card.component";

export type PaymentMethodsLayout = 'horizontal' | 'vertical';

@Component({
  selector: 'app-slides-payment-methods',
  templateUrl: './slides-payment-methods.component.html',
  styleUrls: ['./slides-payment-methods.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    PaymentMethodWalletComponent,
    PaymentMethodCardComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SlidesPaymentMethodsComponent implements OnDestroy, AfterViewInit {
  @ViewChild('swiperPaymentMethods') swiperPaymentMethods?: ElementRef;
  @Input() layout: PaymentMethodsLayout = 'horizontal';
  @Output() paymentSelected = new EventEmitter<PaymentSelection>();

  private subscriptions: Subscription[] = [];

  wallet: Wallet = {} as Wallet;
  bankCards: BankCard[] = [];
  selectedPayment?: PaymentSelection;

  constructor(
    private paymentsService: PaymentsService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {
    this.paymentsService.getCardsBank().subscribe();
    this.paymentsService.getWalletSelected().subscribe();
    this.paymentsService.getMainWallets().subscribe();
    this.autoSubscribe(this.paymentsService.walletSelected(), v => {
      this.wallet = v;
      this.setDefaultPaymentMethod();
    });
    this.autoSubscribe(this.paymentsService.bankCards(), v => this.bankCards = v);
  }

  ngAfterViewInit(): void {
    if (this.layout === 'horizontal' && this.swiperPaymentMethods) {
      const swiperEl = this.swiperPaymentMethods.nativeElement;
      Object.assign(swiperEl, {
        spaceBetween: 8,
        slidesPerView: 'auto',
      });
      swiperEl.initialize();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private setDefaultPaymentMethod(): void {
    if (this.wallet && this.wallet.id && !this.selectedPayment) {
      this.selectedPayment = {
        type: 'wallet',
        wallet: this.wallet
      };
      this.paymentSelected.emit(this.selectedPayment);
    }
  }

  onPaymentSelected(selection: PaymentSelection): void {
    this.selectedPayment = selection;
    this.paymentSelected.emit(selection);
  }

  isWalletSelected(): boolean {
    return this.selectedPayment?.type === 'wallet' &&
           this.selectedPayment?.wallet?.id === this.wallet.id;
  }

  isCardSelected(card: BankCard): boolean {
    return this.selectedPayment?.type === 'card' &&
           this.selectedPayment?.card?.customer === card.customer;
  }

  async navigateToAddCard(): Promise<void> {
    const modal = await this.modalCtrl.getTop();
    if (modal) {
      await this.modalCtrl.dismiss();
    }
    this.navCtrl.navigateForward(['/pages/bank-card/list']);
  }

  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void): void {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }
}
