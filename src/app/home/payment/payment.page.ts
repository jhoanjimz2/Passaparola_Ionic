import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalController } from '@ionic/angular';

import { Subscription, switchMap } from 'rxjs';

import { AmountWithoutRewardsComponent } from './components/business/amount-without-rewards/amount-without-rewards.component';
import { ScanQrComponent } from 'src/app/components/scan-qr/scan-qr.component';
import { Contact } from 'src/app/shared/interfaces/contact/contact.interface';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import { TransferATMRequets } from 'src/app/shared/interfaces/wallet/requets/transfer-atm-requets.interface';
import { Reasons } from 'src/app/shared/interfaces/wallet/enum/reasons.interfaces';
import { Operations } from 'src/app/shared/interfaces/wallet/enum/operations.interfaces';
import {
  CompanyService,
  UserService,
  WalletService,
} from 'src/app/shared/services';
import { Company } from 'src/app/shared/interfaces/company/company.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { PaymentConfirmComponent } from './components/business/payment-confirm/payment-confirm.component';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { SelectListSeatComponent } from 'src/app/components/select-list-seat/select-list-seat.component';

@Component({
  selector: 'app-tpv',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit, OnDestroy {
  amount = '0';
  amountWithoutRewards = '0';
  buttonActive = 'rightButton';
  cashBackPercentage: number = 0;
  companyTo: Company = {} as Company;
  contact: Contact = {} as Contact;
  data: any;
  decimalAmount = '00';
  idOperation: string = '';
  isBusiness = false;
  mainAmount = '0';
  showAtm = false;
  step: string = 'tpv';
  subscriptionMyWallet: Subscription | undefined;
  transferRequest: TransferATMRequets = {} as TransferATMRequets;
  user: User = {} as User;
  userTo: User = {} as User;
  walletFrom: Wallet = {} as Wallet;
  wallets: Wallet[] = [];
  walletTo: Wallet = {} as Wallet;
  seatSelected!: any;
  seat = false;

  constructor(
    private companyService: CompanyService,
    private modalController: ModalController,
    private userService: UserService,
    private route: ActivatedRoute,
    private walletService: WalletService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.seat = localStorage.getItem('appPassaparola_isLoginSeat')!
      ? true
      : false;
    this.user = JSON.parse(localStorage.getItem('appPassaparola_user')!);

    const seatSelected = localStorage.getItem('appPassaparola_loginSeat');
    this.seatSelected = JSON.parse(seatSelected !== null ? seatSelected : '');

    this.myWalletWatch();

    this.route.queryParams.subscribe(async (params: any) => {
      setTimeout(() => {
        if (params?.cancel) {
          this.onGoToHome();

          return;
        }

        if (params?.edit) {
          const amount = params.amount.toString();
          const arrayAmount = amount.split('.');
          this.amount = amount;
          this.mainAmount = arrayAmount[0];
          this.decimalAmount = arrayAmount.length === 2 ? arrayAmount[1] : '00';
          this.buttonActive = 'rightButton';
          this.step = 'tpv';

          return;
        }

        if (params?.tryAgain) {
          const amount = params.amount.toString();
          const arrayAmount = amount.split('.');
          this.amount = amount;
          this.mainAmount = arrayAmount[0];
          this.decimalAmount = arrayAmount.length === 2 ? arrayAmount[1] : '00';
          this.data = {
            amount: this.amount,
            wallet: params.wallet,
          };
          this.buttonActive = 'rightButton';
          this.step = 'app-payment-qr';

          return;
        }
      }, 0);
    });
  }

  ionViewDidEnter() {
    this.onGoToHome();
    this.getWallets();
  }

  ngOnDestroy() {
    this.subscriptionMyWallet?.unsubscribe();
  }

  myWalletWatch() {
    this.subscriptionMyWallet = this.walletService
      .myWalletWatch()
      .subscribe((wallet: Wallet) => {
        if (!wallet) return;
        this.walletTo = wallet;
      });
  }

  getWallets() {
    this.walletService.findWalletsByUserId(this.user.userID!).subscribe({
      next: (response) => {
        this.wallets = response;
        const defaultWallet = this.wallets.find((wallet) => wallet.default);
        const walletSelected: any = localStorage.getItem('walletSelected');
        this.walletTo = walletSelected
          ? JSON.parse(walletSelected)
          : this.wallets[0];
      },
    });
  }

  onChangeAmount({
    amount,
    mainAmount,
    decimalAmount,
  }: {
    amount: string;
    mainAmount: string;
    decimalAmount: string;
  }) {
    this.amount = amount;
    this.mainAmount = mainAmount;
    this.decimalAmount = decimalAmount;
  }

  async onAmountWithoutRewardsModal() {
    const modal = await this.modalController.create({
      component: AmountWithoutRewardsComponent,
      cssClass: 'modal-80vh',
      backdropDismiss: true,
      componentProps: {
        amountWithoutRewards: this.amountWithoutRewards,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.amountWithoutRewards) {
      this.amountWithoutRewards = data.amountWithoutRewards;

      this.amount = (
        parseFloat(this.amount) + parseFloat(this.amountWithoutRewards)
      ).toString();

      this.mainAmount = this.amount.split('.')[0];
      this.decimalAmount = this.buildDecimal(this.amount.split('.')[1]);
    }
  }

  async onSelectListSeatComponentModal() {
    const modal = await this.modalController.create({
      component: SelectListSeatComponent,
      cssClass: 'modal-85vh',
      backdropDismiss: true,
      componentProps: {
        seatSelected: this.seatSelected,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.seatSelected) {
      this.seatSelected = data.seatSelected;
      localStorage.setItem(
        'appPassaparola_loginSeat',
        JSON.stringify(data.seatSelected)
      );
    }
  }

  buildDecimal(decimal: string): string {
    if (decimal && decimal.length) {
      if (decimal.length === 1) return `${decimal}0`;
      else if (decimal.length === 2) return decimal;
    }

    return '00';
  }

  async getPayment() {
    if (parseFloat(this.mainAmount) <= 0) return;

    if (this.buttonActive === 'leftButton') {
      const modal = await this.modalController.create({
        component: ScanQrComponent,
        backdropDismiss: true,
        componentProps: {},
      });
      await modal.present();
      const { data } = await modal.onDidDismiss();

      if (!data) return;

      const qrValue: string = data.qrValue;
      let dataQrValue: any;

      if (qrValue.includes('wallet')) dataQrValue = JSON.parse(qrValue);

      this.getWalletByUserIdAndProg(dataQrValue ? dataQrValue.wallet : qrValue);
    } else {
      this.step = 'app-payment-qr';

      this.data = {
        wallet: `${this.walletTo.userId}-${this.walletTo.prog}`,
        amount: this.amount,
      };
    }
  }

  getWalletByUserIdAndProg(code: string) {
    this.walletService
      .findWalletByUserIdAndProg(code)
      .pipe(
        switchMap((wallet) => {
          this.walletFrom = wallet;
          const checkUserIdTo = wallet.userId.charAt(wallet.userId.length - 1);
          if (checkUserIdTo === 'B' || checkUserIdTo === 'P') {
            this.isBusiness = true;
            return this.companyService.getCompanyByUserId(wallet.userId);
          }
          return this.userService.getUserByUserID(wallet.userId);
        })
      )
      .subscribe((response) => {
        if (this.isBusiness) this.companyTo = response as Company;
        if (!this.isBusiness) this.userTo = response as User;

        this.contact = {
          name: !this.isBusiness
            ? `${this.userTo.profile?.name} ${this.userTo.profile?.lastName}`
            : `${this.companyTo.profile?.name}`,
          user: this.userTo,
          company: this.companyTo,
          isBussines: this.isBusiness,
        };

        this.step = 'payment-resume';
      });
  }

  async onConfirmOperationModal() {
    const modal = await this.modalController.create({
      component: PaymentConfirmComponent,
      backdropDismiss: true,
      componentProps: {
        amount: this.amount,
        contact: this.contact,
        transferRequets: this.transferRequest,
      },
      cssClass: 'modal-75vh',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data?.nextStep) {
      this.confirmTransfer();
    }
  }

  onCancelOperation() {
    this.step = 'tpv';
  }

  async confirmTransfer() {
    this.transferRequest = {
      walletFrom: this.walletFrom.id!,
      walletTo: this.walletTo.id!,
      amount: parseFloat(this.amount),
      amountWithoutRewards: parseFloat(this.amountWithoutRewards),
      isCash: true,
      typeOperation: Operations.transfer,
      status: 1,
      reason: Reasons.payment,
      observation: '',
      reasonStatusTransfer: Reasons.payment,
      rewardPercentage:
        this.authenticationService.user.profile.rewardPercentage,
      cashBackPercentage:
        this.authenticationService.user.profile.cashBackPercentage,
      helpPercentage: this.authenticationService.user.profile.helpPercentage,
      drawingPercentage:
        this.authenticationService.user.profile.drawingPercentage,
      communityPercentage:
        this.authenticationService.user.profile.communityPercentage,
      pointsPercentage:
        this.authenticationService.user.profile.pointsPercentage,
    };

    this.walletService
      .transferATM({
        ...this.transferRequest,
        transactionType: 'receive',
      })
      .subscribe({
        next: (response) => {
          const arrayId = response.id.split('-');
          this.idOperation = arrayId[arrayId.length - 1];
          this.cashBackPercentage = response.cashBackPercentage;
          this.step = 'traditional-payment-success';
        },
        error: () => {},
      });
  }

  onGoToHome() {
    this.amount = '0';
    this.mainAmount = '0';
    this.decimalAmount = '00';
    this.step = 'tpv';
  }

  onGoToHomeFromApp() {
    this.step = 'tpv';
  }

  onActiveButton(buttonActive: string) {
    this.buttonActive = buttonActive;
  }
}
