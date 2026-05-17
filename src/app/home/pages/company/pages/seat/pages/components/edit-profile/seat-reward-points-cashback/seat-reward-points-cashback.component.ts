import { Component, Input, OnDestroy, OnInit }             from '@angular/core';
import { Keyboard }                                        from '@capacitor/keyboard';
import { CommonModule }                                    from '@angular/common';
import { IonicModule, ModalController }                    from '@ionic/angular';

import { TranslateModule }                                 from '@ngx-translate/core';
import { Capacitor }                                       from '@capacitor/core';
import { SocialSummary }                                   from 'src/app/shared/interfaces/multiple-profile-business/social-summary';
import { SocialService }                                   from 'src/app/shared/services/social.service';
import { Observable, Subscription }                        from 'rxjs';

@Component({
  selector: 'app-seat-reward-points-cashback',
  templateUrl: './seat-reward-points-cashback.component.html',
  styleUrls: ['./seat-reward-points-cashback.component.scss'],
  standalone: true,
  imports: [TranslateModule, IonicModule, CommonModule],
})
export class SeatRewardPointsCashbackComponent implements OnInit, OnDestroy {
  @Input() min: number = 5;
  @Input() max: number = 12;

  decimalSeparator: string = ',';
  percentages: any = {
    cashBackPercentage: '0',
    communityPercentage: '0',
    pointsPercentage: '0',
    rewardPercentage: '0',
    helpPercentage: '0',
    drawingPercentage: '0',
  };
  total: string = '';

  private showListener: any;
  private hideListener: any;
  keyboardIsOpen = false;

  subscriptions: Subscription[] = [];
  seat: SocialSummary = {} as SocialSummary;

  constructor(
    private modalController: ModalController,
    private socialService: SocialService
  ) {
    if (Capacitor.isNativePlatform()) {
      this.showListener = Keyboard.addListener('keyboardWillShow', () => {
        this.keyboardIsOpen = true;
      });

      this.hideListener = Keyboard.addListener('keyboardWillHide', () => {
        this.keyboardIsOpen = false;
      });
    }
    this.autoSubscribe(this.socialService.seatObservable, v => this.seat = v);
  }
  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }

  ngOnInit() {
    this.initPercentage(this.seat.targetInfo?.seatInfo?.rewardPercentage!);
  }

  ngOnDestroy() {
    this.showListener?.remove?.();
    this.hideListener?.remove?.();
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onSave() {
    this.modalController.dismiss({
      next: true,
      percentages: {
        rewardPercentage: this.convertPercentageToNumber(
          this.percentages.rewardPercentage
        ),
        cashBackPercentage: this.convertPercentageToNumber(
          this.percentages.cashBackPercentage
        ),
        communityPercentage: this.convertPercentageToNumber(
          this.percentages.communityPercentage
        ),
        helpPercentage: this.convertPercentageToNumber(
          this.percentages.helpPercentage
        ),
        drawingPercentage: this.convertPercentageToNumber(
          this.percentages.drawingPercentage
        ),
        pointsPercentage: this.convertPercentageToNumber(
          this.percentages.pointsPercentage
        ),
      },
    });
  }

  onCancel() {
    this.modalController.dismiss();
  }

  private convertPercentageToNumber(percentageStr: string): number {
    return parseFloat(percentageStr.replace(',', '.'));
  }

  setRewardPercentage(event: any) {
    this.percentages.rewardPercentage = event.target.value;

    this.initPercentage(
      this.convertPercentageToNumber(this.percentages.rewardPercentage)
    );
  }

  private initPercentage(rewardPercentage: number) {
    this.percentages.rewardPercentage =
      this.formatNumberToDecimalString(rewardPercentage);

    this.percentages.cashBackPercentage = this.formatNumberToDecimalString(
      rewardPercentage * 0.05
    );

    this.percentages.pointsPercentage = this.formatNumberToDecimalString(
      rewardPercentage * 0.65
    );

    this.percentages.communityPercentage = this.formatNumberToDecimalString(
      rewardPercentage * 0.25
    );

    this.percentages.helpPercentage = this.formatNumberToDecimalString(
      rewardPercentage * 0.025
    );

    this.percentages.drawingPercentage = this.formatNumberToDecimalString(
      rewardPercentage * 0.025
    );

    this.sumPercentage();
  }

  private sumPercentage() {
    const total =
      this.convertPercentageToNumber(this.percentages.cashBackPercentage) +
      this.convertPercentageToNumber(this.percentages.pointsPercentage) +
      this.convertPercentageToNumber(this.percentages.communityPercentage) +
      this.convertPercentageToNumber(this.percentages.helpPercentage) +
      this.convertPercentageToNumber(this.percentages.drawingPercentage);

    this.total = this.formatNumberToDecimalString(total);
  }

  private formatNumberToDecimalString(value: number): string {
    const [integerPart, decimalPart = ''] = value.toFixed(2).split('.');
    const thousandSeparator: string = '';

    const formattedIntegerPart = integerPart.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      thousandSeparator
    );

    const formattedDecimalPart = decimalPart.substring(0, 2);

    return `${formattedIntegerPart}${this.decimalSeparator}${formattedDecimalPart}`;
  }
}
