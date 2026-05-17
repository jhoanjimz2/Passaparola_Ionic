import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { CheckPhoneComponent } from './components/check-phone/check-phone.component';

@Component({
  selector: 'app-passaparola-card',
  templateUrl: './passaparola-card.page.html',
  styleUrls: ['./passaparola-card.page.scss'],
})
export class PassaparolaCardPage implements OnInit {
  option: '' | 'assing' | 'recharge' = '';

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  continue() {
    if (this.option === '') return;
    if (this.option === 'assing') this.checkPhone();
    if (this.option === 'recharge') return; //to do
  }

  async checkPhone() {
    const modal = await this.modalController.create({
      component: CheckPhoneComponent,
      cssClass: 'modal-100vh',
      backdropDismiss: true,
      componentProps: {},
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
  }
}
