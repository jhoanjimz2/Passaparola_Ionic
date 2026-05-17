import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment-success-recharges',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
})
export class PaymentSuccessComponent {
  @Input() decimalAmount: string = '00';
  @Input() idOperation: string = '';
  @Input() mainAmount: string = '0';
  @Input() wallet: string = '';
  @Output() callCancelOperation = new EventEmitter<void>();
  @Output() callConfirmOperationModal = new EventEmitter<void>();

  constructor(private modalController: ModalController) {}

  onGoToHome() {
    this.modalController.dismiss();
  }
}
