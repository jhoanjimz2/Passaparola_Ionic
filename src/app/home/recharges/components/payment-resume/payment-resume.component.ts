import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment-resume-recharges',
  templateUrl: './payment-resume.component.html',
  styleUrls: ['./payment-resume.component.scss'],
})
export class PaymentResumeComponent {
  @Input() decimalAmount: string = '00';
  @Input() mainAmount: string = '0';
  @Input() wallet: string = '';
  @Output() callCancelOperation = new EventEmitter<void>();
  @Output() callConfirmOperationModal = new EventEmitter<void>();

  constructor(private modalController: ModalController) {}

  onCancelOperation() {
    this.modalController.dismiss();
  }

  onConfirmOperationModal() {
    this.modalController.dismiss({
      nextStep: true,
    });
  }
}
