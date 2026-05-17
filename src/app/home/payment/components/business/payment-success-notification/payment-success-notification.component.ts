import { Component, Input, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment-success-notification',
  templateUrl: './payment-success-notification.component.html',
  styleUrls: ['./payment-success-notification.component.scss'],
})
export class PaymentSuccessNotificationComponent implements OnInit {
  @Input() amount: number = 0;
  @Input() idOperation: string = '';

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  onClose() {
    this.modalController.dismiss();
  }
}
