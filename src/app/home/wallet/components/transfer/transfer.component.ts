import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { ConfirmationPinComponent } from 'src/app/components/confirmation-pin/confirmation-pin.component';
import { Contact } from 'src/app/shared/interfaces/contact/contact.interface';
import { TransferSuccessfullyComponent } from '../transfer-successfully/transfer-successfully.component';
import { WalletService } from 'src/app/shared/services';
import { TransferATMRequets } from 'src/app/shared/interfaces/wallet/requets/transfer-atm-requets.interface';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import { Operations } from 'src/app/shared/interfaces/wallet/enum/operations.interfaces';
import { Reasons } from 'src/app/shared/interfaces/wallet/enum/reasons.interfaces';
import { TransfernErrorComponent } from '../transfern-error/transfern-error.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent implements OnInit {
  @Input() amount = 0;
  @Input() contact: Contact = {} as Contact;
  @Input() walletFrom: Wallet = {} as Wallet;
  @Input() walletTo: Wallet = {} as Wallet;
  @Input() transactionType: 'send' | 'receive' | undefined;
  transferRequets: TransferATMRequets = {} as TransferATMRequets;
  formTransfern: FormGroup = {} as FormGroup;
  confirm = false;
  date = new Date();

  constructor(
    private formBuild: FormBuilder,
    private modalController: ModalController,
    private walletService: WalletService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  async ngOnInit() {
    this.buildForm();

    if (!this.transactionType) {
      this.toastr.error(
        this.translate.instant(
          'WALLET.MODAL_TRANSFER.TYPE_TRANSACTION_NOT_DEFINED'
        )
      );
      let modal = await this.modalController.getTop();
      while (modal) {
        await this.modalController.dismiss();
        modal = await this.modalController.getTop();
      }
      return;
    }
  }

  buildForm() {
    this.formTransfern = this.formBuild.group({
      amount: new FormControl(this.amount, [
        Validators.required,
        Validators.min(0.1),
      ]),
      reason: new FormControl('', []),
    });
  }

  next() {
    this.confirm = true;
  }

  getValueComfirm(ev: any) {
    this.confirm = false;
  }

  async confirmTransfer() {
    let isBussines = false;
    const checkUserIdTo = this.walletFrom.userId.charAt(
      this.walletFrom.userId.length - 1
    );

    if (checkUserIdTo === 'B' || checkUserIdTo === 'P') isBussines = true;

    this.modalController.dismiss();

    if (this.amount >= 50) {
      const modal = await this.modalController.create({
        component: ConfirmationPinComponent,
        backdropDismiss: true,
        componentProps: { isCompany: isBussines },
        cssClass: 'modal-95vh',
      });
      await modal.present();
      const { data } = await modal.onDidDismiss();

      if (data.pin) {
        this.transferRequets = {
          walletFrom: this.walletFrom.id!,
          walletTo: this.walletTo.id!,
          amount: this.amount,
          typeOperation: Operations.transfer,
          status: 1,
          reason: Reasons.send,
          observation: this.formTransfern.controls['reason'].value,
          reasonStatusTransfer: Reasons.send,
          transactionType: this.transactionType,
        };
        if (this.contact.isBussines) {
          this.transferRequets = {
            ...this.transferRequets,
            rewardPercentage: this.contact.company?.profile?.rewardPercentage,
            cashBackPercentage:
              this.contact.company?.profile?.cashBackPercentage,
            helpPercentage: this.contact.company?.profile?.helpPercentage,
            drawingPercentage: this.contact.company?.profile?.drawingPercentage,
            communityPercentage:
              this.contact.company?.profile?.communityPercentage,
            pointsPercentage: this.contact.company?.profile?.pointsPercentage,
          };
        }
        this.walletService.transferATM(this.transferRequets).subscribe({
          next: (response) => {
            const arrayId = response.id.split('-');
            const idTransaction = arrayId[arrayId.length - 1];
            this.getWalletById();
            this.transferSuccessfully(idTransaction);
          },
          error: () => {
            this.transferError();
          },
        });
      }
      return;
    }

    this.transferRequets = {
      walletFrom: this.walletFrom.id!,
      walletTo: this.walletTo.id!,
      amount: this.amount,
      typeOperation: Operations.transfer,
      status: 1,
      reason: Reasons.send,
      observation: this.formTransfern.controls['reason'].value,
      reasonStatusTransfer: Reasons.send,
      transactionType: this.transactionType,
    };
    if (this.contact.isBussines) {
      this.transferRequets = {
        ...this.transferRequets,
        rewardPercentage: this.contact.company?.profile?.rewardPercentage,
        cashBackPercentage: this.contact.company?.profile?.cashBackPercentage,
        helpPercentage: this.contact.company?.profile?.helpPercentage,
        drawingPercentage: this.contact.company?.profile?.drawingPercentage,
        communityPercentage: this.contact.company?.profile?.communityPercentage,
        pointsPercentage: this.contact.company?.profile?.pointsPercentage,
      };
    }
    this.walletService.transferATM(this.transferRequets).subscribe({
      next: (response) => {
        const arrayId = response.id.split('-');
        const idTransaction = arrayId[arrayId.length - 1];
        this.getWalletById();
        this.transferSuccessfully(idTransaction);
      },
      error: () => {
        this.transferError();
      },
    });
  }

  async transferSuccessfully(idTransaction: string) {
    const modal = await this.modalController.create({
      component: TransferSuccessfullyComponent,
      backdropDismiss: true,
      componentProps: {
        amount: this.amount,
        contact: this.contact,
        idTransaction,
      },
      cssClass: 'modal-full-screen',
    });
    await modal.present();
  }

  getWalletById() {
    let wallet: Wallet = {} as Wallet;
    if (this.transactionType === 'receive') wallet = this.walletTo;
    if (this.transactionType === 'send') wallet = this.walletFrom;

    this.walletService.findWalletById(wallet.id!).subscribe({
      next: (response) => {
        this.walletService.myWalletSet(response);
      },
    });
  }

  async transferError() {
    const modal = await this.modalController.create({
      component: TransfernErrorComponent,
      backdropDismiss: true,
      componentProps: {
        amount: this.amount,
        contact: this.contact,
        transferRequets: this.transferRequets,
      },
      cssClass: 'modal-full-screen',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }
}
