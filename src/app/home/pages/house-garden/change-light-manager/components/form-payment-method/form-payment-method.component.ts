import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentMethodComponent }                 from "../payment-method/payment-method.component";
import { CommonModule }                           from '@angular/common';
import { IonRadioGroup }                          from '@ionic/angular/standalone';
import { FormsModule }                            from '@angular/forms';
import { Contract }                               from 'src/app/shared/interfaces/contract/contract';

@Component({
  selector: 'app-form-payment-method',
  templateUrl: './form-payment-method.component.html',
  styleUrls: ['./form-payment-method.component.scss'],
  standalone: true,
  imports: [
    PaymentMethodComponent,
    CommonModule,
    IonRadioGroup,
    FormsModule
  ]
})
export class FormPaymentMethodComponent {
  @Output() save_data = new EventEmitter<any>();
  @Input() contract: Contract = {} as Contract;
  @Input() bankWallet: any;
  @Input() bankCards: any;
  @Input() bankAccounts: any;

  selectedValue: string = '';

  // Checkboxes
  acceptInvoices: boolean = false;
  acceptDirectDebit: boolean = false;
  acceptTerms: boolean = false;

  onRadioChange(event: any) {
    this.selectedValue = event.detail.value;
    // Reset checkboxes cuando cambie el método de pago
    this.resetCheckboxes();
  }

  isMethodSelected(type: string, methodId?: string): boolean {
    const value = 'radio-' + type + (methodId ? '-' + methodId : '');
    return this.selectedValue === value;
  }

  getSelectedPaymentType(): 'wallet' | 'card' | 'bank' | null {
    if (!this.selectedValue) return null;

    if (this.selectedValue.includes('wallet')) return 'wallet';
    if (this.selectedValue.includes('card')) return 'card';
    if (this.selectedValue.includes('bank')) return 'bank';

    return null;
  }

  isWalletSelected(): boolean {
    return this.getSelectedPaymentType() === 'wallet';
  }

  canContinue(): boolean {
    // Debe tener un método de pago seleccionado
    if (!this.selectedValue) return false;

    const paymentType = this.getSelectedPaymentType();

    // Para wallet: deben aceptar los 3 checks
    if (paymentType === 'wallet') {
      return this.acceptInvoices && this.acceptDirectDebit && this.acceptTerms;
    }

    // Para card o bank: solo necesitan aceptar términos
    if (paymentType === 'card' || paymentType === 'bank') {
      return this.acceptTerms;
    }

    return false;
  }

  resetCheckboxes() {
    this.acceptInvoices = false;
    this.acceptDirectDebit = false;
    this.acceptTerms = false;
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (!this.canContinue()) {
      return;
    }

    this.save_data.emit({
      // data: {
      //   selectedPayment: this.selectedValue,
      //   paymentType: this.getSelectedPaymentType(),
      //   acceptInvoices: this.acceptInvoices,
      //   acceptDirectDebit: this.acceptDirectDebit,
      //   acceptTerms: this.acceptTerms
      // },
      step: 4
    });
  }
}
