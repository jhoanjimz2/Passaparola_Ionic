import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment-confirm',
  templateUrl: './payment-confirm.component.html',
  styleUrls: ['./payment-confirm.component.scss'],
})
export class PaymentConfirmComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  onConfirmOperation() {
    this.modalController.dismiss({
      nextStep: true,
    });
  }
}
