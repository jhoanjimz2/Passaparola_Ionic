import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ContactsComponent } from '../contacts/contacts.component';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { KeyboardAtmComponent } from 'src/app/components/keyboard-atm/keyboard-atm.component';
import { TransferComponent } from '../transfer/transfer.component';
import { Contact } from 'src/app/shared/interfaces/contact/contact.interface';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import { Company } from 'src/app/shared/interfaces/company/company.interface';
import { QrCodeComponent } from '../qr-code/qr-code.component';
import { GenerateQrCodeComponent } from '../generate-qr-code/generate-qr-code.component';

@Component({
  selector: 'app-receive-modal',
  templateUrl: './receive-modal.component.html',
  styleUrls: ['./receive-modal.component.scss'],
})
export class ReceiveModalComponent implements OnInit {
  userTo: User = {} as User;
  companyTo: Company = {} as Company;
  @Input() walletFrom: Wallet = {} as Wallet;
  @Input() walletTo: Wallet = {} as Wallet;
  isBussines = false;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async modalQrCode() {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: QrCodeComponent,
      backdropDismiss: true,
      componentProps: {
        data: `${this.walletFrom.userId}-${this.walletFrom.prog}`,
      },
    });
    await modal.present();
  }

  async generateQR(amount: number) {
    const data = {
      wallet: `${this.walletFrom.userId}-${this.walletFrom.prog}`,
      amount,
    };
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: GenerateQrCodeComponent,
      backdropDismiss: true,
      componentProps: {
        data: JSON.stringify(data),
      },
    });
    await modal.present();
  }

  async modalContacts() {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: ContactsComponent,
      backdropDismiss: true,
      componentProps: {
        walletTo: this.walletFrom,
        transactionType: 'receive',
        walletFrom: this.walletTo,
      },
      cssClass: 'modal-full-screen',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }

  async modalKeyboard() {
    const modal = await this.modalController.create({
      component: KeyboardAtmComponent,
      backdropDismiss: true,
      componentProps: { balance: this.walletFrom.balance },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (!data) return;
    const amount = parseFloat(data.amount);
    this.generateQR(amount);
  }

  async modalTransfer(amount: number) {
    const contact: Contact = {
      name: !this.isBussines
        ? `${this.userTo.profile?.name} ${this.userTo.profile?.lastName}`
        : `${this.companyTo.profile?.name}`,
      user: this.userTo,
      company: this.companyTo,
      isBussines: this.isBussines,
    };
    const modal = await this.modalController.create({
      component: TransferComponent,
      backdropDismiss: true,
      componentProps: {
        amount,
        contact,
        walletFrom: this.walletFrom,
        walletTo: this.walletTo,
      },
      cssClass: 'modal-full-screen',
    });
    await modal.present();
  }
}
