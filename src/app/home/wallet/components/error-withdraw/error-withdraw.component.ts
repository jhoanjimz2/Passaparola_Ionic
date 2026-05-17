import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TransferATMRequets } from 'src/app/shared/interfaces/wallet/requets/transfer-atm-requets.interface';
import { WalletService } from 'src/app/shared/services';
import { SuccessfullyWithdrawComponent } from '../successfully-withdraw/successfully-withdraw.component';
import { IBankAccount } from 'src/app/shared/interfaces/bank-account/bank-account.interface';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import { WithdrawTransfer } from 'src/app/shared/interfaces/wallet/withdraw-transfer';

@Component({
  selector: 'app-error-withdraw',
  templateUrl: './error-withdraw.component.html',
  styleUrls: ['./error-withdraw.component.scss'],
})
export class ErrorWithdrawComponent implements OnInit {
  @Input() transferRequets: WithdrawTransfer | undefined;
  @Input() idTransaction: string = '';
  @Input() bankAccount: IBankAccount = {} as IBankAccount;

  constructor(
    private modalController: ModalController,
    private walletService: WalletService
  ) {}

  ngOnInit() {}

  backToHome() {
    this.modalController.dismiss();
  }

  withdraw() {
    this.walletService.createWithdrawTransfer(this.transferRequets!).subscribe({
      next: async (response) => {
        this.modalController.dismiss();
        const modal = await this.modalController.create({
          component: SuccessfullyWithdrawComponent,
          backdropDismiss: true,
          componentProps: {
            bankAccount: this.bankAccount,
            amount: this.transferRequets?.amount,
            idTransaction: response.transactionId,
          },
          cssClass: 'modal-full-screen',
        });
        await modal.present();
      },
    });
  }
}
