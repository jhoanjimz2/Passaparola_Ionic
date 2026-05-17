import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Contact } from 'src/app/shared/interfaces/contact/contact.interface';
import { TransferATMRequets } from 'src/app/shared/interfaces/wallet/requets/transfer-atm-requets.interface';
import { WalletService } from 'src/app/shared/services';
import { TransferSuccessfullyComponent } from '../transfer-successfully/transfer-successfully.component';

@Component({
  selector: 'app-transfern-error',
  templateUrl: './transfern-error.component.html',
  styleUrls: ['./transfern-error.component.scss'],
})
export class TransfernErrorComponent implements OnInit {
  @Input() amount = 0;
  @Input() contact: Contact = {} as Contact;
  @Input() transferRequets: TransferATMRequets = {} as TransferATMRequets;
  date = new Date();

  constructor(
    private modalController: ModalController,
    private walletService: WalletService
  ) {}

  ngOnInit() {}

  transferATM() {
    this.walletService.transferATM(this.transferRequets).subscribe({
      next: (response) => {
        const arrayId = response.id.split('-');
        const idTransaction = arrayId[arrayId.length - 1];
        this.getWalletById();
        this.transferSuccessfully(idTransaction);
      },
    });
  }

  async transferSuccessfully(idTransaction: string) {
    const modal = await this.modalController.create({
      component: TransferSuccessfullyComponent,
      backdropDismiss: true,
      componentProps: {
        amount: this.amount,
        contact: this.contact,
        idTransaction,
      },
      cssClass: 'modal-full-screen',
    });
    await modal.present();
  }

  getWalletById() {
    this.walletService
      .findWalletById(this.transferRequets.walletFrom)
      .subscribe({
        next: (response) => {
          this.walletService.myWalletSet(response);
        },
      });
  }

  backToHome() {
    this.modalController.dismiss();
  }
}
