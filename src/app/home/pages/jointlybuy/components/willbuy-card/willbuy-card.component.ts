import { CommonModule }                                from '@angular/common';
import { Component, OnInit, OnDestroy, Input }         from '@angular/core';
import { IonicModule, ModalController, NavController } from "@ionic/angular";
import { Willbuy }                                     from 'src/app/shared/interfaces/jointlybuy/willbuy';
import { FormattNumberPipe }                           from 'src/app/shared/pipes';
import { ModalBuyWillbuyComponent }                    from '../modal-buy-willbuy/modal-buy-willbuy.component';

@Component({
  selector: 'app-willbuy-card',
  templateUrl: './willbuy-card.component.html',
  styleUrls: ['./willbuy-card.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormattNumberPipe
  ]
})
export class WillbuyCardComponent  implements OnInit, OnDestroy {
  @Input() willbuy!: Willbuy;

  daysRemaining: number = 0;
  hoursRemaining: number = 0;
  minutesRemaining: number = 0;
  secondsRemaining: number = 0;

  private countdownInterval?: ReturnType<typeof setInterval>;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdown() {
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  private updateCountdown() {
    const now = new Date().getTime();
    const buyInDate = new Date(this.willbuy.buyIn!).getTime();
    const buyEndDate = new Date(this.willbuy.buyEnd!).getTime();

    let targetDate: number;

    if (now < buyInDate) {
      targetDate = buyInDate;
    }
    else if (now < buyEndDate) {
      targetDate = buyEndDate;
    }
    else {
      this.daysRemaining = 0;
      this.hoursRemaining = 0;
      this.minutesRemaining = 0;
      this.secondsRemaining = 0;

      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
      return;
    }
    const difference = targetDate - now;

    if (difference > 0) {
      this.daysRemaining = Math.floor(difference / (1000 * 60 * 60 * 24));
      this.hoursRemaining = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutesRemaining = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      this.secondsRemaining = Math.floor((difference % (1000 * 60)) / 1000);
    } else {
      this.daysRemaining = 0;
      this.hoursRemaining = 0;
      this.minutesRemaining = 0;
      this.secondsRemaining = 0;
    }
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

  view() {
    this.navCtrl.navigateForward(['/pages/jointlybuy/view-willbuy', this.willbuy.id], {
      queryParams: { public: false }
    });
  }

  async openModalBuyWillbuy() {
    const modal = await this.modalCtrl.create({
      component: ModalBuyWillbuyComponent,
      componentProps: {
        id: this.willbuy.id
      },
      cssClass: ['radius-modals', 'modal-85vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1
    });
    await modal.present();
  }
}
