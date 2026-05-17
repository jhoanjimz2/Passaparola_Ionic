import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { switchMap } from 'rxjs';

import { ScanQrComponent } from 'src/app/components/scan-qr/scan-qr.component';
import { ContactsComponent } from '../contacts/contacts.component';
import { WalletIDComponent } from '../wallet-id/wallet-id.component';
import {
  CompanyService,
  UserService,
  WalletService,
} from 'src/app/shared/services';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { KeyboardAtmComponent } from 'src/app/components/keyboard-atm/keyboard-atm.component';
import { TransferComponent } from '../transfer/transfer.component';
import { Contact } from 'src/app/shared/interfaces/contact/contact.interface';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import { Company } from 'src/app/shared/interfaces/company/company.interface';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements OnInit {
  userTo: User = {} as User;
  companyTo: Company = {} as Company;
  @Input() walletFrom: Wallet = {} as Wallet;
  walletTo: Wallet = {} as Wallet;
  isBussines = false;

  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private walletService: WalletService,
    private companyService: CompanyService
  ) {}

  ngOnInit() {}

  async modalQrScan() {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: ScanQrComponent,
      backdropDismiss: true,
      componentProps: {},
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (!data) return;
    let amount = 0;
    let wallet = '';
    const qrValue: string = data.qrValue;
    if (qrValue.includes('amount') && qrValue.includes('wallet')) {
      const dataQrValue = JSON.parse(qrValue);
      wallet = dataQrValue.wallet;
      amount = dataQrValue.amount;
    }
    this.getWalletByUserIdAndProg(wallet ? wallet : qrValue, amount);
  }

  async modalContacts() {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: ContactsComponent,
      backdropDismiss: true,
      componentProps: {
        walletFrom: this.walletFrom,
        transactionType: 'send',
      },
      cssClass: 'modal-full-screen',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }

  async modalWalletId() {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: WalletIDComponent,
      backdropDismiss: true,
      componentProps: { walletFrom: this.walletFrom },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }

  getWalletByUserIdAndProg(code: string, amount: number) {
    this.walletService
      .findWalletByUserIdAndProg(code)
      .pipe(
        switchMap((wallet) => {
          this.walletTo = wallet;
          const checkUserIdTo = wallet.userId.charAt(wallet.userId.length - 1);
          if (checkUserIdTo === 'B' || checkUserIdTo === 'P') {
            this.isBussines = true;
            return this.companyService.getCompanyByUserId(wallet.userId);
          }
          return this.userService.getUserByUserID(wallet.userId);
        })
      )
      .subscribe((response) => {
        if (this.isBussines) this.companyTo = response as Company;
        if (!this.isBussines) this.userTo = response as User;

        if (amount) {
          this.modalTransfer(amount);
          return;
        }
        this.modalKeyboard();
      });
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
    this.modalTransfer(amount);
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
        transactionType: 'send',
      },
      cssClass: 'modal-full-screen',
    });
    await modal.present();
  }
}
