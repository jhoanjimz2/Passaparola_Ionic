import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-keyboard-tpv',
  templateUrl: './keyboard-tpv.component.html',
  styleUrls: ['./keyboard-tpv.component.scss'],
})
export class KeyboardTpvComponent implements OnInit {
  @Output() onChangeAmount = new EventEmitter<{
    amount: string;
    mainAmount: string;
    decimalAmount: string;
  }>();
  amount = '0';
  decimalAmount = '00';
  formAmount: FormGroup = {} as FormGroup;
  mainAmount = '0';
  showAtm = false;
  typePayment = 'leftButton';

  constructor(private formBuild: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.formAmount = this.formBuild.group({
      amount: new FormControl(0, [Validators.required, Validators.min(0.1)]),
    });

    this.formAmount.get('amount')?.valueChanges.subscribe((value: any) => {
      const amount = value.toString();
      const mainAmount = amount.split('.')[0];
      const decimalAmount = this.buildDecimal(amount.split('.')[1]);

      this.onChangeAmount.emit({ amount, mainAmount, decimalAmount });
    });
  }

  buildDecimal(decimal: string): string {
    if (decimal && decimal.length) {
      if (decimal.length === 1) return `${decimal}0`;
      else if (decimal.length === 2) return decimal;
    }

    return '00';
  }

  inputValue(input: string) {
    if (
      this.amount.length > 10 &&
      !(this.amount.includes('.') || input === '.')
    )
      return;

    if (this.amount === '0') {
      this.amount = input;
      this.formAmount.controls['amount'].setValue(this.amount);
      return;
    }

    this.amount += input;

    if (this.amount.includes('.')) {
      const arrayAmount = this.amount.split('.');
      this.amount = arrayAmount[0] + '.' + arrayAmount[1].substring(0, 2);
      this.formAmount.controls['amount'].setValue(this.amount);
      return;
    }

    this.formAmount.controls['amount'].setValue(this.amount);
  }

  erase() {
    this.amount = this.amount.slice(0, -1);
    if (!this.amount) {
      this.formAmount.controls['amount'].setValue(0);

      return;
    }
    this.formAmount.controls['amount'].setValue(this.amount);
  }
}
