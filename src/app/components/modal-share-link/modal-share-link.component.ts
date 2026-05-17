import { Component, Input, OnInit }                              from '@angular/core';
import { Contacts }                                              from '@capacitor-community/contacts';
import { Share }                                                 from '@capacitor/share';
import { ModalController }                                       from '@ionic/angular';
import { Contact }                                               from 'src/app/shared/interfaces/contact/contact.interface';
import { User }                                                  from 'src/app/shared/interfaces/user/user.interface';
import { UserService, UtilsService }                             from 'src/app/shared/services';
import { ToastrService }                                         from 'ngx-toastr';
import { IonCol, IonContent, IonGrid, IonIcon, IonRow, IonText } from '@ionic/angular/standalone';
import { CommonModule }                                          from '@angular/common';
import { ComponentModule }                                       from '../component.module';
import { FormsModule }                                           from '@angular/forms';
import { ContactSharePipe }                                      from 'src/app/shared/pipes/contact-share.pipe';

@Component({
  selector: 'app-modal-share-link',
  templateUrl: './modal-share-link.component.html',
  styleUrls: ['./modal-share-link.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ComponentModule,
    ContactSharePipe,
    FormsModule,
    IonContent,
    IonIcon,
    IonRow,
    IonCol,
    IonGrid,
    IonText,
  ]
})
export class ModalShareLinkComponent implements OnInit {
  @Input() shareUrl: string = '';
  @Input() shareText: string = 'Dai un\'occhiata a questo link!';

  contacts: Contact[] = [];
  unregisteredContacts: Contact[] = [];
  usersContact: User[] = [];
  search = '';
  showUnregisteredContacts = false;

  constructor(
    private userService: UserService,
    private modalController: ModalController,
    private utilsService: UtilsService,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    if (!this.shareUrl) {
      this.toastr.error('URL da condividere non definito');
      this.closeModal();
      return;
    }
    this.getContactsData();
    console.log(this,this.shareUrl)
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

  async shareWithContact() {
    try {
      await Share.share({
        text: `${this.shareText}`,
        url: this.shareUrl
      });
      this.toastr.success('Link condiviso con successo!');
      this.closeModal();
    } catch (error) {
      this.toastr.error('Errore nella condivisione del link');
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
