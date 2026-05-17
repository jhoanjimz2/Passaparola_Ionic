import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Contact } from 'src/app/shared/interfaces/contact/contact.interface';

@Component({
  selector: 'app-transfer-successfully',
  templateUrl: './transfer-successfully.component.html',
  styleUrls: ['./transfer-successfully.component.scss'],
})
export class TransferSuccessfullyComponent implements OnInit {
  @Input() amount = 0;
  @Input() contact: Contact = {} as Contact;
  date = new Date();
  @Input() idTransaction = '';

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  backToHome() {
    this.modalController.dismiss();
  }
}
