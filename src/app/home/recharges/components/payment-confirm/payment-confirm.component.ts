import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment-confirm-recharges',
  templateUrl: './payment-confirm.component.html',
  styleUrls: ['./payment-confirm.component.scss'],
})
export class PaymentConfirmComponent {
  constructor(private modalController: ModalController) {}

  onConfirmOperationModal() {
    this.modalController.dismiss({
      nextStep: true,
    });
  }
}
