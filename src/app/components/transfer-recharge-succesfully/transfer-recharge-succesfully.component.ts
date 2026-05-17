import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-transfer-recharge-succesfully',
  templateUrl: './transfer-recharge-succesfully.component.html',
  styleUrls: ['./transfer-recharge-succesfully.component.scss'],
})
export class TransferRechargeSuccesfullyComponent implements OnInit {
  @Input() amount = 0;
  @Input() idTransaction = '';

  constructor(
    private modalController: ModalController,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {}

  async backToHome() {
    this.spinner.show();
    try {
      let modal = await this.modalController.getTop();

      while (modal) {
        await this.modalController.dismiss();
        modal = await this.modalController.getTop();
      }
    } catch (error) {
      console.error('Error closing modals:', error);
    }
    this.spinner.hide();
  }
}
