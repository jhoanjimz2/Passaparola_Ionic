import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ScanNfcComponent } from './components/scan-nfc/scan-nfc.component';

@Component({
  selector: 'app-add-nfc',
  templateUrl: './add-nfc.page.html',
  styleUrls: ['./add-nfc.page.scss'],
})
export class AddNFCPage implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async scanModal() {
    const modal = await this.modalController.create({
      component: ScanNfcComponent,
      backdropDismiss: true,
      componentProps: {},
      cssClass: 'modal-full-screen',
    });
    await modal.present();
  }
}
