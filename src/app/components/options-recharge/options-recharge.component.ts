import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import { RechargeComponent } from '../recharge/recharge.component';
import { ModalRechargeTransferComponent } from '../modal-recharge-transfer/modal-recharge-transfer.component';
import { PassaparolaCashComponent } from '../../home/wallet/components/passaparola-cash/passaparola-cash.component';

@Component({
  selector: 'app-options-recharge',
  templateUrl: './options-recharge.component.html',
  styleUrls: ['./options-recharge.component.scss'],
})
export class OptionsRechargeComponent implements OnInit {
  @Input() wallet: Wallet = {} as Wallet;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async modalRecharge() {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: RechargeComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { wallet: this.wallet },
    });
    await modal.present();
  }

  async modalRechargeTransfer() {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: ModalRechargeTransferComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { wallet: this.wallet },
    });
    await modal.present();
  }

  async modalPassaparolaCash() {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: PassaparolaCashComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { wallet: this.wallet },
    });
    await modal.present();
  }
}
