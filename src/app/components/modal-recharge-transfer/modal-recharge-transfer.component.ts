import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { PaymentMethod } from 'src/app/shared/interfaces/stripe/payment-method.interface';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import { WalletService } from 'src/app/shared/services';
import { MainWallets } from 'src/app/shared/interfaces/wallet/main-wallets.interface';
import { TransferATMRequets } from 'src/app/shared/interfaces/wallet/requets/transfer-atm-requets.interface';
import { ModalRechargeTransferInfoComponent } from '../modal-recharge-transfer-info/modal-recharge-transfer-info.component';

interface Action {
  icon: string;
  title: string;
  index: number;
}

@Component({
  selector: 'app-modal-recharge-transfer',
  templateUrl: './modal-recharge-transfer.component.html',
  styleUrls: ['./modal-recharge-transfer.component.scss'],
})
export class ModalRechargeTransferComponent implements OnInit {
  @Input() wallet: Wallet = {} as Wallet;
  formWithdraw: FormGroup = {} as FormGroup;
  amounts: number[] = [100.0, 150.0, 250.0, 500.0];
  options: Action[] = [
    {
      icon: 'cash-outline',
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
  paymentMethods: PaymentMethod[] = [];
  paymentMethod: PaymentMethod | undefined;
  loading = false;
  indexPayment = 0;
  mainWallets: MainWallets = {} as MainWallets;
  transferRequets: TransferATMRequets = {} as TransferATMRequets;

  constructor(
    private formBuild: FormBuilder,
    private modalController: ModalController,
    private walletService: WalletService
  ) {}

  async ngOnInit() {
    this.buildForm();
    this.getMainWallets();
  }

  buildForm() {
    this.formWithdraw = this.formBuild.group({
      amount: new FormControl(0, [Validators.required, Validators.min(0.1)]),
    });
  }

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

  getMainWallets() {
    this.walletService.findMainWallets().subscribe({
      next: (response) => (this.mainWallets = response),
    });
  }

  async recharge() {
    this.loading = true;
    this.formWithdraw.controls['amount'].setValue(
      +this.formWithdraw.controls['amount'].value
    );

    const modal = await this.modalController.create({
      component: ModalRechargeTransferInfoComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: {
        amount: this.formWithdraw.controls['amount'].value,
        wallet: this.wallet,
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (!data) return;
  }

  getWalletById() {
    this.walletService.findWalletById(this.wallet.id!).subscribe({
      next: (response) => {
        this.walletService.myWalletSet(response);
      },
    });
  }
}
