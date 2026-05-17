import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-amount-without-rewards',
  templateUrl: './amount-without-rewards.component.html',
  styleUrls: ['./amount-without-rewards.component.scss'],
})
export class AmountWithoutRewardsComponent implements OnInit {
  @Input() amountWithoutRewards: any = {};
  decimalAmount = '00';
  mainAmount = '0';
  showAtm = false;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  onChangeAmount({
    amount,
    mainAmount,
    decimalAmount,
  }: {
    amount: string;
    mainAmount: string;
    decimalAmount: string;
  }) {
    this.amountWithoutRewards = amount;
    this.mainAmount = mainAmount;
    this.decimalAmount = decimalAmount;
  }

  onCloseModal() {
    this.modalController.dismiss();
  }

  onSave() {
    this.modalController.dismiss({
      nextStep: true,
      amountWithoutRewards: this.amountWithoutRewards,
    });
  }
}
