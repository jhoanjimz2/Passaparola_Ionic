import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  IBankAccount,
  IResponseBankAccount,
} from 'src/app/shared/interfaces/bank-account/bank-account.interface';

import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import { BankAccountService } from 'src/app/shared/services/bank-account.service';
import { ConfirmWithdrawComponent } from '../confirm-withdraw/confirm-withdraw.component';

interface Action {
  icon: string;
  title: string;
  index: number;
}

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss'],
})
export class WithdrawComponent implements OnInit {
  @Input() wallet: Wallet = {} as Wallet;
  formWithdraw: FormGroup = {} as FormGroup;
  amounts: number[] = [100.0, 150.0, 250.0, 500.0];
  options: Action[] = [
    {
      icon: 'passaparola-museum',
      title: 'WALLET.MODAL_WITHDRAW.BACK_TRANSFER',
      index: 1,
    },
    {
      icon: 'cash-outline',
      title: 'WALLET.MODAL_WITHDRAW.ATM_PASSAPAROLA',
      index: 2,
    },
    {
      icon: 'cash-outline',
      title: 'WALLET.MODAL_WITHDRAW.PASSAPAROLA_CASH',
      index: 3,
    },
  ];
  optionActive = 0;
  bankAccounts: IBankAccount[] = [];
  bankAccount: IBankAccount = {} as IBankAccount;
  indexAccount = 0;

  constructor(
    private formBuild: FormBuilder,
    private bankAccountService: BankAccountService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.buildForm();
    this.findAll();
  }

  buildForm() {
    this.formWithdraw = this.formBuild.group({
      amount: new FormControl(0, [Validators.required, Validators.min(0.1)]),
    });
  }

  withdraw() {}

  focus() {
    if (this.formWithdraw.controls['amount'].value === 0)
      this.formWithdraw.controls['amount'].setValue('');
  }

  losesFocus() {
    if (this.formWithdraw.controls['amount'].value === '')
      this.formWithdraw.controls['amount'].setValue(0);
  }

  setAmount(amount: number) {
    this.formWithdraw.controls['amount'].setValue(amount);
  }

  findAll() {
    this.bankAccountService
      .findAll({
        filterUser: true,
        offset: 1,
        limit: 100,
      })
      .subscribe(({ data, metadata }: IResponseBankAccount) => {
        this.bankAccounts = data;
      });
  }

  getLastFourDigits(value: string) {
    const digitsOnly = value.replace(/\D/g, '');
    return digitsOnly.slice(-4);
  }

  async modalConfirm() {
    const modal = await this.modalController.create({
      component: ConfirmWithdrawComponent,
      backdropDismiss: true,
      componentProps: {
        bankAccount: this.bankAccount,
        amount: this.formWithdraw.controls['amount'].value,
        wallet: this.wallet,
      },
      cssClass: 'modal-full-screen',
    });
    await modal.present();
  }
}
