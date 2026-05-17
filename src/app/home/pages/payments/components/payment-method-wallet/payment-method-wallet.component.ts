import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule }                           from '@angular/common';
import { IonIcon }                                from "@ionic/angular/standalone";
import { Wallet }                                 from 'src/app/shared/interfaces/wallet/wallet.interface';
import { PaymentSelection }                       from 'src/app/shared/interfaces/payments/payment-selection.interface';
import { FormattNumberPipe }                      from 'src/app/shared/pipes';

@Component({
  selector: 'app-payment-method-wallet',
  templateUrl: './payment-method-wallet.component.html',
  styleUrls: ['./payment-method-wallet.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    FormattNumberPipe
  ]
})
export class PaymentMethodWalletComponent {
  @Input() wallet: Wallet = {} as Wallet;
  @Input() selected: boolean = false;
  @Output() paymentSelected = new EventEmitter<PaymentSelection>();

  isViewed: boolean = false;

  onSelectPayment(): void {
    this.paymentSelected.emit({
      type: 'wallet',
      wallet: this.wallet
    });
  }

  toggleView(event: Event): void {
    event.stopPropagation();
    this.isViewed = !this.isViewed;
  }
}
