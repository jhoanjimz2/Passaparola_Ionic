import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-accept-atm-successfully',
  templateUrl: './accept-atm-successfully.component.html',
  styleUrls: ['./accept-atm-successfully.component.scss'],
})
export class AcceptAtmSuccessfullyComponent implements OnInit {
  @Input() action: 'accept' | 'decline' | '' = '';
  @Input() amount = 0;
  @Input() nameFrom = '';
  @Input() transactionType: 'send' | 'receive' | undefined;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }
}
