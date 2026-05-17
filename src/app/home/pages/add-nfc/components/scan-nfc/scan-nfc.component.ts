import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ModalScanComponent } from '../modal-scan/modal-scan.component';
import { SecurityAmountComponent } from '../security-amount/security-amount.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-scan-nfc',
  templateUrl: './scan-nfc.component.html',
  styleUrls: ['./scan-nfc.component.scss'],
})
export class ScanNfcComponent implements OnInit {
  nfcSerial = '';
  nfcType = '';
  nfcTypeSelected = '';

  constructor(
    private modalController: ModalController,
    private navController: NavController,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.scanModal();
  }

  async scanModal() {
    const modal = await this.modalController.create({
      component: ModalScanComponent,
      backdropDismiss: true,
      componentProps: {},
      cssClass: 'modal-85vh',
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.nfcSerial = data.id;
      return;
    }

    this.spinner.show();
    let modalActive = await this.modalController.getTop();
    while (modalActive) {
      await this.modalController.dismiss();
      modalActive = await this.modalController.getTop();
    }
    this.spinner.hide();
  }

  async continue() {
    if (this.nfcTypeSelected === 'keychain') {
      this.nfcType = '20c5a4ce-55c2-404c-b502-a3cf48eee39b';
    }

    if (this.nfcTypeSelected === 'sticker') {
      this.nfcType = 'a5a78dfb-87a1-444d-aedc-dc6ab136d3e5';
    }

    if (this.nfcTypeSelected === 'passaparola_card') {
      this.nfcType = 'b3aeb850-ea5e-422a-8a64-80ee0e4cfef0';
    }

    if (this.nfcTypeSelected === 'other_divice') {
      this.nfcType = 'a4735b1e-2ef4-4adf-91c8-894d431246a7';
    }

    const modal = await this.modalController.create({
      component: SecurityAmountComponent,
      backdropDismiss: true,
      componentProps: { nfcType: this.nfcType, nfcSerial: this.nfcSerial },
      cssClass: 'modal-full-screen',
    });
    await modal.present();
  }
}
