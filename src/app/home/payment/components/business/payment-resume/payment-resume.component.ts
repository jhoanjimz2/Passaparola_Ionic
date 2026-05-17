import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-payment-resume',
  templateUrl: './payment-resume.component.html',
  styleUrls: ['./payment-resume.component.scss'],
})
export class PaymentResumeComponent {
  @Input() amountWithoutRewards: string = '0';
  @Input() decimalAmount: string = '00';
  @Input() mainAmount: string = '0';
  @Output() callCancelOperation = new EventEmitter<void>();
  @Output() callConfirmOperationModal = new EventEmitter<void>();

  onCancelOperation() {
    this.callCancelOperation.emit();
  }

  onConfirmOperationModal() {
    this.callConfirmOperationModal.emit();
  }

  parseFloat(amount: string): number {
    return parseFloat(amount);
  }
}
