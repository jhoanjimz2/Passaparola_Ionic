import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { switchMap } from 'rxjs';

import {
  ETypeActionButton,
  TypeActionButton,
} from 'src/app/shared/types/type-action-button.type';
import { ScanQrComponent } from '../scan-qr/scan-qr.component';
import {
  CompanyService,
  UserService,
  WalletService,
  WebsocketService,
} from 'src/app/shared/services';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import { Company } from 'src/app/shared/interfaces/company/company.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { ClientPaymentResumeComponent } from 'src/app/home/payment/components/client/client-payment-resume/client-payment-resume.component';
import { ConfirmationPinComponent } from '../confirmation-pin/confirmation-pin.component';
import { KeyboardAtmComponent } from '../keyboard-atm/keyboard-atm.component';
import { TransferComponent } from 'src/app/home/wallet/components/transfer/transfer.component';
import { Contact } from 'src/app/shared/interfaces/contact/contact.interface';
import { TransferATMRequets } from 'src/app/shared/interfaces/wallet/requets/transfer-atm-requets.interface';
import { Operations } from 'src/app/shared/interfaces/wallet/enum/operations.interfaces';
import { Reasons } from 'src/app/shared/interfaces/wallet/enum/reasons.interfaces';
import { ClientPaymentSuccessComponent } from 'src/app/home/payment/components/client/client-payment-success/client-payment-success.component';
import { ClientPaymentDeniedComponent } from 'src/app/home/payment/components/client/client-payment-denied/client-payment-denied.component';
import { SeatService } from 'src/app/shared/services/seat.service';

@Component({
  selector: 'app-page-action-button',
  templateUrl: './page-action-button.component.html',
  styleUrls: ['./page-action-button.component.scss'],
})
export class PageActionButtonComponent implements OnInit {
  @Input() icon = '';
  @Input() typeActionButton: TypeActionButton =
    ETypeActionButton.variousCircles;

  eTypeActionButton = ETypeActionButton;

  amount: number = 0;
  walletTo: Wallet = {} as Wallet;
  isBussines = false;
  companyTo: Company = {} as Company;
  userTo: User = {} as User;
  cashBack: number = 0;
  points: number = 0;
  walletFrom: Wallet = {} as Wallet;
  transferRequest: TransferATMRequets = {} as TransferATMRequets;
  idOperation: string = '';
  userId: string = '';
  user: User | Company | undefined;
  isModalOpenQr = false;

  constructor(
    private modalController: ModalController,
    private walletService: WalletService,
    private companyService: CompanyService,
    private userService: UserService,
    private websocketService: WebsocketService,
    private seatService: SeatService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('appPassaparola_user')!);
    this.getDefaultWallet(this.user?.userID!);
  }

  getDefaultWallet(userId: string) {
    this.walletService.findDefaultWallet(userId).subscribe({
      next: (response) => {
        this.walletFrom = response;
      },
    });
  }

  async modalQrScan() {
    if (this.isModalOpenQr) return;

    this.isModalOpenQr = true;

    const modal = await this.modalController.create({
      component: ScanQrComponent,
      backdropDismiss: true,
      componentProps: {},
      id: 'ScanQrComponent',
    });

    modal.onDidDismiss().then(() => {
      this.isModalOpenQr = false;
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (!data) return;

    let amount = 0;
    let wallet = '';
    const qrValue: string = data.qrValue;
    if (qrValue.includes('amount') && qrValue.includes('wallet')) {
      const dataQrValue = JSON.parse(qrValue);
      wallet = dataQrValue.wallet;
      amount = dataQrValue.amount;
      this.amount = dataQrValue.amount;
    }
    this.getWalletByUserIdAndProg(wallet ? wallet : qrValue, amount);
  }

  getWalletByUserIdAndProg(code: string, amount: number) {
    this.walletService
      .findWalletByUserIdAndProg(code)
      .pipe(
        switchMap((wallet) => {
          this.walletTo = wallet;
          const checkUserIdTo = wallet.userId.charAt(wallet.userId.length - 1);
          if (checkUserIdTo === 'B' || checkUserIdTo === 'P') {
            this.isBussines = true;
            return this.companyService.getCompanyByUserId(wallet.userId);
          }
          return this.userService.getUserByUserID(wallet.userId);
        })
      )
      .subscribe((response: any) => {
        if (this.isBussines) this.companyTo = response as Company;
        if (!this.isBussines) this.userTo = response as User;

        if (amount) {
          // // this.modalTransfer(amount);
          // //       this.companyTo = response as Company;

          // this.cashBack =
          //   (this.amount * response.profile?.cashBackPercentage!) / 100;
          // this.points =
          //   (this.amount * response.profile?.pointsPercentage!) / 100;
          // return;

          this.companyTo = response as any;

          this.cashBack = this.isBussines
            ? (this.amount * response.profile?.cashBackPercentage!) / 100
            : 0;
          this.points = this.isBussines
            ? (this.amount * response.profile?.pointsPercentage!) / 100
            : 0;

          this.onOpenModalClientPaymentResume(this.walletTo.id!);

          return;
        }
        this.modalKeyboard();
      });
  }

  async onOpenModalClientPaymentResume(walletId: string) {
    this.seatService.findOneByWalletId(walletId).subscribe({
      next: async (response) => {
        this.cashBack = this.isBussines
          ? (this.amount * response.cashBackPercentage!) / 100
          : 0;
        this.points = this.isBussines
          ? (this.amount * response.pointsPercentage!) / 100
          : 0;

        const modal = await this.modalController.create({
          component: ClientPaymentResumeComponent,
          cssClass: 'modal-full-screen',
          backdropDismiss: true,
          componentProps: {
            amount: this.amount,
            cashBack: this.cashBack,
            companyAddress: this.companyTo.profile?.legalAddress,
            companyName: this.companyTo.profile?.name,
            points: this.points,
            profilePictureUrlFile:
              this.companyTo.profile?.profilePictureUrlFile,
          },
        });
        await modal.present();

        const { data } = await modal.onWillDismiss();

        if (data?.confirmTransfer) {
          if (this.amount >= 50) {
            let isBussines = false;
            const checkUserIdTo = this.walletFrom.userId.charAt(
              this.walletFrom.userId.length - 1
            );

            if (checkUserIdTo === 'B' || checkUserIdTo === 'P')
              isBussines = true;
            const modal = await this.modalController.create({
              component: ConfirmationPinComponent,
              backdropDismiss: true,
              componentProps: { isCompany: isBussines },
              cssClass: 'modal-95vh',
            });
            await modal.present();
            const { data } = await modal.onDidDismiss();

            if (data.pin) this.confirmTransfer();
          } else this.confirmTransfer();
        }
      },
    });
  }

  async modalKeyboard() {
    const modal = await this.modalController.create({
      component: KeyboardAtmComponent,
      backdropDismiss: true,
      componentProps: { balance: this.walletFrom.balance },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (!data) return;
    const amount = parseFloat(data.amount);
    this.modalTransfer(amount);
  }

  async modalTransfer(amount: number) {
    const contact: Contact = {
      name: !this.isBussines
        ? `${this.userTo.profile?.name} ${this.userTo.profile?.lastName}`
        : `${this.companyTo.profile?.name}`,
      user: this.userTo,
      company: this.companyTo,
      isBussines: this.isBussines,
    };

    const modal = await this.modalController.create({
      component: TransferComponent,
      backdropDismiss: true,
      componentProps: {
        amount,
        contact,
        walletFrom: this.walletFrom,
        walletTo: this.walletTo,
        transactionType: 'send',
      },
      cssClass: 'modal-full-screen',
    });

    await modal.present();
  }

  async confirmTransfer() {
    this.transferRequest = {
      walletFrom: this.walletFrom.id!,
      walletTo: this.walletTo.id!,
      amount: this.amount,
      isCash: false,
      typeOperation: Operations.transfer,
      status: 1,
      reason: Reasons.payment,
      observation: '',
      reasonStatusTransfer: Reasons.payment,
      rewardPercentage: this.companyTo.profile?.rewardPercentage,
      cashBackPercentage: this.companyTo.profile?.cashBackPercentage,
      helpPercentage: this.companyTo.profile?.helpPercentage,
      drawingPercentage: this.companyTo.profile?.drawingPercentage,
      communityPercentage: this.companyTo.profile?.communityPercentage,
      pointsPercentage: this.companyTo.profile?.pointsPercentage,
    };

    this.walletService
      .transferATM({ ...this.transferRequest, transactionType: 'send' })
      .subscribe({
        next: (response) => {
          const arrayId = response.id.split('-');
          this.idOperation = arrayId[arrayId.length - 1];

          this.onOpenModalClientPaymentSuccess();
        },
        error: () => {
          this.onOpenModalClientPaymentDenied();
        },
      });
  }

  async onOpenModalClientPaymentSuccess() {
    const modal = await this.modalController.create({
      component: ClientPaymentSuccessComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: {
        amount: this.amount,
        cashBack: this.cashBack,
        companyAddress: this.companyTo.profile?.legalAddress,
        companyName: this.companyTo.profile?.name,
        points: this.points,
        profilePictureUrlFile: this.companyTo.profile?.profilePictureUrlFile,
      },
    });
    await modal.present();
  }

  async onOpenModalClientPaymentDenied() {
    const modal = await this.modalController.create({
      component: ClientPaymentDeniedComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: {
        amount: this.amount,
        cashBack: this.cashBack,
        companyName: this.companyTo.profile?.name,
        idOperation: this.idOperation,
        points: this.points,
        profilePictureUrlFile: this.companyTo.profile?.profilePictureUrlFile,
      },
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.confirmTransfer) this.confirmTransfer();

    if (data?.cancel) this.cancelTransfer();
  }

  cancelTransfer() {
    this.websocketService.emitMessage({
      userId: this.userId,
      type: 'cancelPayment',
      payload: {
        amount: this.amount,
        wallet: `${this.walletTo.userId}-${this.walletTo.prog}`,
      },
    });
  }
}
