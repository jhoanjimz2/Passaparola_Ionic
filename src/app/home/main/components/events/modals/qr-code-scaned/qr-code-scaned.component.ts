import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ScanQrComponent } from 'src/app/components/scan-qr/scan-qr.component';
import { Ticket } from 'src/app/shared/interfaces/events/events';

@Component({
  selector: 'app-qr-code-scaned',
  templateUrl: './qr-code-scaned.component.html',
  styleUrls: ['./qr-code-scaned.component.scss'],
})
export class QrCodeScanedComponent implements OnInit {
  @Input() ticket: Ticket = {} as Ticket;

  isModalOpenQr = false;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async modalQrScan() {
    if (this.isModalOpenQr) return;

    this.isModalOpenQr = true;

    const modal = await this.modalController.create({
      component: ScanQrComponent,
      backdropDismiss: true,
      componentProps: {},
      id: 'ScanQrComponent',
    });

    modal.onDidDismiss().then(() => {
      this.isModalOpenQr = false;
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.updateInfo();
  }

  updateInfo() {}
}
