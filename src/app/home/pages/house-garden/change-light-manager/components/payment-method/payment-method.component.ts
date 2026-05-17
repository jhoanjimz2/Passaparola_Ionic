import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { IonRadio, IonItem, IonIcon } from '@ionic/angular/standalone';
import { CommonModule }                            from '@angular/common';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonRadio,
    IonItem,
    IonIcon
  ]
})
export class PaymentMethodComponent {
  @Input() type: 'wallet' | 'bank' | 'card' = 'wallet';
  @Input() method: any;
  @Input() isSelected: boolean = false;
  @ViewChild('radioElement', { read: ElementRef }) radioElement!: ElementRef;

  selectPayment() {
    const radioNative = this.radioElement.nativeElement;
    radioNative.click();
  }

  getTitle(): string {
    switch (this.type) {
      case 'card':
        return this.method.owner || '';
      case 'bank':
        return `Bonifico bancario ${this.method.bankName || ''}`;
      case 'wallet':
        return 'Wallet Passaparola';
      default:
        return '';
    }
  }

  getIconName(): string {
    switch (this.type) {
      case 'card':
        return 'passaparola-card';
      case 'bank':
        return 'passaparola-museum';
      case 'wallet':
        return 'passaparola-wallet-icon';
      default:
        return '';
    }
  }
}
