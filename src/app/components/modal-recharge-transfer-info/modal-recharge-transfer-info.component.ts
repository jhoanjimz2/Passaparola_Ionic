import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ToastrService } from 'ngx-toastr';
import { TransferRecharge } from 'src/app/shared/interfaces/wallet/transfer-recharge.interface';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import { WalletService } from 'src/app/shared/services';
import { TransferRechargeSuccesfullyComponent } from '../transfer-recharge-succesfully/transfer-recharge-succesfully.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-recharge-transfer-info',
  templateUrl: './modal-recharge-transfer-info.component.html',
  styleUrls: ['./modal-recharge-transfer-info.component.scss'],
})
export class ModalRechargeTransferInfoComponent implements OnInit {
  @Input() amount = 0;
  @Input() wallet: Wallet = {} as Wallet;
  textToCopy = '';
  date = new Date();
  cause = '';

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService,
    private walletService: WalletService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    const randomNum = Math.random() * 10000;
    const num = Math.round(randomNum).toString().padStart(5, '0');
    this.cause = num + this.date.getTime().toString();
  }

  onCopyDataToClipboard(info: string, removeBlank: boolean): void {
    try {
      this.textToCopy = info;
      if (removeBlank) this.textToCopy = info.replace(/\s+/g, '');
      navigator.clipboard.writeText(this.textToCopy);
      this.toastr.success(
        this.translate.instant('GENERAL.INFO_COPIED'),
        '',
        {}
      );
    } catch (err) {
      this.toastr.error(
        this.translate.instant('GENERAL.INFO_COPY_ERROR'),
        '',
        {}
      );
    }
  }

  confirm() {
    const transferRecharge: TransferRecharge = {
      addressee: 'Passaparola lda',
      iban: 'PT5000180036204108202035',
      bicSwift: 'TOTAPTPL',
      transactionId: this.cause,
      amount: this.amount,
      walletTo: this.wallet.id!,
    };

    this.walletService.createTransferRecharge(transferRecharge).subscribe({
      next: async (response) => {
        this.modalController.dismiss();
        const arrayId = response.id!.split('-');
        const idTransaction = arrayId[arrayId.length - 1];
        const modal = await this.modalController.create({
          component: TransferRechargeSuccesfullyComponent,
          cssClass: 'modal-full-screen',
          backdropDismiss: true,
          componentProps: {
            amount: this.amount,
            idTransaction,
          },
        });
        await modal.present();
      },
    });
  }
}
