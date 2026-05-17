import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IBankAccount } from 'src/app/shared/interfaces/bank-account/bank-account.interface';

@Component({
  selector: 'app-successfully-withdraw',
  templateUrl: './successfully-withdraw.component.html',
  styleUrls: ['./successfully-withdraw.component.scss'],
})
export class SuccessfullyWithdrawComponent implements OnInit {
  @Input() amount = 0;
  date = new Date();
  @Input() idTransaction = '';
  @Input() bankAccount: IBankAccount = {} as IBankAccount;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async backToHome() {
    let modal = await this.modalController.getTop();
    while (modal) {
      await this.modalController.dismiss();
      modal = await this.modalController.getTop();
    }
  }

  getLastFourDigits(value: string) {
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.slice(-4);
  }
}
