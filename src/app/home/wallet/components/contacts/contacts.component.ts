import { Component, Input, OnInit } from '@angular/core';
import { Contacts } from '@capacitor-community/contacts';

import { Contact } from 'src/app/shared/interfaces/contact/contact.interface';
import {
  UserService,
  UtilsService,
  WalletService,
} from 'src/app/shared/services';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { ModalController } from '@ionic/angular';
import { KeyboardAtmComponent } from 'src/app/components/keyboard-atm/keyboard-atm.component';
import { TransferComponent } from '../transfer/transfer.component';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  unregisteredContacts: Contact[] = [];
  usersContact: User[] = [];
  search = '';
  showUnregisteredContacts = false;
  contactSeletd: Contact = {} as Contact;
  @Input() walletFrom: Wallet = {} as Wallet;
  @Input() walletTo: Wallet = {} as Wallet;
  @Input() transactionType: 'send' | 'receive' | undefined;

  constructor(
    private userService: UserService,
    private modalController: ModalController,
    private walletService: WalletService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private utilsService: UtilsService
  ) {}

  async ngOnInit() {
    this.getContactsData();
    if (!this.transactionType) {
      this.toastr.error('Tipo de transación no definida');
      let modal = await this.modalController.getTop();
      while (modal) {
        await this.modalController.dismiss();
        modal = await this.modalController.getTop();
      }
      return;
    }
  }

  getDefaultWallet(userId: string, amount: number) {
    this.walletService.findDefaultWallet(userId).subscribe({
      next: (response) => {
        const walletTo = response;
        this.modalTransfer(amount, walletTo);
      },
    });
  }

  async getContactsData() {
    const result = await Contacts.getContacts({
      projection: {
        name: true,
        phones: true,
        postalAddresses: true,
      },
    });
    const contacts = result.contacts;
    const phones: string[] = [];

    contacts.forEach((contact) => {
      if (contact.phones)
        phones.push(
          contact.phones![0].number?.replace(/\s+/g, '').replace(/-/g, '')!
        );
    });

    this.userService.getUsersByPhone(phones).subscribe({
      next: (response) => {
        this.usersContact = response;
        contacts.forEach((contact) => {
          this.usersContact.forEach((user) => {
            if (!contact.phones) return;

            if (
              contact
                .phones![0].number?.replace(/\s+/g, '')
                .replace(/-/g, '')! !==
              user.country?.phonePrefix! + user.phoneNumber
            )
              return;

            this.contacts.push({
              name: contact.name?.display ? contact.name?.display! : '',
              phone: contact
                .phones![0].number?.replace(/\s+/g, '')
                .replace(/-/g, '')!,
              user: user,
            });
          });
        });

        const unregisteredContacts = contacts.filter(
          (contact) =>
            !this.contacts.some((contactRegistered) => {
              return (
                contact.phones &&
                contactRegistered.phone ===
                  contact
                    .phones![0].number?.replace(/\s+/g, '')
                    .replace(/-/g, '')!
              );
            })
        );

        this.unregisteredContacts = unregisteredContacts.map((contact) => {
          return {
            name: contact.name?.display ? contact.name?.display! : '',
            phone: contact.phones
              ? contact
                  .phones![0].number?.replace(/\s+/g, '')
                  .replace(/-/g, '')!
              : '',
          };
        });

        this.contacts = this.utilsService.sortByField(
          this.contacts,
          'name',
          true
        );

        this.unregisteredContacts = this.utilsService.sortByField(
          this.unregisteredContacts,
          'name',
          true
        );
      },
    });
  }

  async modalKeyboard(contact: Contact) {
    this.contactSeletd = contact;
    const modal = await this.modalController.create({
      component: KeyboardAtmComponent,
      backdropDismiss: true,
      componentProps: { balance: this.walletFrom.balance },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    this.getDefaultWallet(
      this.contactSeletd.user?.userID!,
      parseFloat(data.amount)
    );
  }

  async modalTransfer(amount: number, walletTo: Wallet) {
    const modal = await this.modalController.create({
      component: TransferComponent,
      backdropDismiss: true,
      componentProps: {
        amount,
        contact: this.contactSeletd,
        // walletFrom: this.walletFrom,
        walletFrom: this.walletTo.id ? walletTo : this.walletFrom,
        // walletTo: walletTo,
        walletTo: this.walletTo.id ? this.walletTo : walletTo,
        transactionType: this.transactionType,
      },
      cssClass: 'modal-full-screen',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }
}
