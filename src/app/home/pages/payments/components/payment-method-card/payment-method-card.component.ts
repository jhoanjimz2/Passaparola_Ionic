import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { BankCard, PaymentSelection }             from 'src/app/shared/interfaces/payments/payment-selection.interface';


@Component({
  selector: 'app-payment-method-card',
  templateUrl: './payment-method-card.component.html',
  styleUrls: ['./payment-method-card.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class PaymentMethodCardComponent {
  @Input() card: BankCard = {} as BankCard;
  @Input() selected: boolean = false;
  @Output() paymentSelected = new EventEmitter<PaymentSelection>();

  onSelectPayment(): void {
    this.paymentSelected.emit({
      type: 'card',
      card: this.card
    });
  }
}
