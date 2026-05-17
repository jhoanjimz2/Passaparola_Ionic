import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-keyboard-atm',
  templateUrl: './keyboard-atm.component.html',
  styleUrls: ['./keyboard-atm.component.scss'],
})
export class KeyboardAtmComponent implements OnInit {
  formAmount: FormGroup = {} as FormGroup;
  amount = '0';
  showAtm = false;
  @Input() balance = 0;

  constructor(
    private formBuild: FormBuilder,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.formAmount = this.formBuild.group({
      amount: new FormControl(0, [Validators.required, Validators.min(0.1)]),
    });
  }

  // inputValue(input: string) {
  //   if (this.amount === '0') {
  //     this.amount = input;
  //     this.formAmount.controls['amount'].setValue(this.amount);
  //     return;
  //   }
  //   this.amount += input;
  //   if (this.amount.includes('.')) {
  //     const arrayAmount = this.amount.split('.');
  //     this.amount = arrayAmount[0] + '.' + arrayAmount[1].substring(0, 2);
  //     this.formAmount.controls['amount'].setValue(this.amount);
  //     return;
  //   }
  //   this.formAmount.controls['amount'].setValue(this.amount);
  // }
  inputValue(input: string) {
    if (input === '.' && this.amount.includes('.')) {
      return;
    }

    if (this.amount === '0' && input !== '.') {
      this.amount = input;
    } else {
      this.amount += input;
    }

    if (this.amount.includes('.')) {
      const [integerPart, decimalPart] = this.amount.split('.');
      this.amount =
        integerPart + '.' + (decimalPart ? decimalPart.substring(0, 2) : '');
    }

    if (!this.amount.includes('.') && this.amount !== '0') {
      this.amount = this.amount.replace(/^0+/, '') || '0';
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

  sendAmount() {
    this.modalController.dismiss({
      amount: this.formAmount.controls['amount'].value,
    });
  }
}
