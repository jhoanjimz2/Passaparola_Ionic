import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment-cancel-notification',
  templateUrl: './payment-cancel-notification.component.html',
  styleUrls: ['./payment-cancel-notification.component.scss'],
})
export class PaymentCancelNotificationComponent implements OnInit {
  @Input() amount: number = 0;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  onTryAgain() {
    this.modalController.dismiss({ tryAgain: true });
  }

  onEdit() {
    this.modalController.dismiss({ edit: true });
  }

  onCancel() {
    this.modalController.dismiss({ cancel: true });
  }
}
