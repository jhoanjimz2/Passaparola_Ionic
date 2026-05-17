import { Component, OnDestroy, OnInit }   from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

import { Subscription }                   from 'rxjs';

import { ActionsComponent }               from './components/actions/actions.component';
import { Wallet }                         from '../../shared/interfaces/wallet/wallet.interface';
import { WalletService }                  from 'src/app/shared/services';
import { User }                           from 'src/app/shared/interfaces/user/user.interface';
import { MovementsComponent }             from './components/movements/movements.component';
import { Win }                            from 'src/app/shared/interfaces/wins/win.interface';
import { ReceiveModalComponent }          from './components/receive-modal/receive-modal.component';
import { WithdrawComponent }              from './components/withdraw/withdraw.component';
import { QrCodeComponent }                from './components/qr-code/qr-code.component';
import { OptionsRechargeComponent }       from 'src/app/components/options-recharge/options-recharge.component';
import { RechargeSuccesfullyComponent }   from 'src/app/components/recharge-succesfully/recharge-succesfully.component';
import { MyWalletsComponent }             from './components/my-wallets/my-wallets.component';
import { MovCashBackComponent }           from './components/mov-cash-back/mov-cash-back.component';
import { WithdrawRewardsComponent }       from './components/withdraw-rewards/withdraw-rewards.component';
import { NfcDivice }                      from 'src/app/shared/interfaces/passaparolaCard/nfc-divice.interface';
import { NfcDiviceService }               from 'src/app/shared/services/nfc-divice.service';
import { IdentityGateService }            from 'src/app/shared/services/Identity-gate.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit, OnDestroy {
  wallets: Wallet[] = [];
  wallet: Wallet = {} as Wallet;
  user: User = {} as User;
  wins: Win[] = [];
  totalWins = 0;
  walletDrawing: Wallet = {} as Wallet;
  subscriptionMyWallet: Subscription | undefined;
  showModalWallets = false;
  showMoreBtn = false;
  nfcDivices: NfcDivice[] = [];

  constructor(
    private modalController: ModalController,
    private walletService: WalletService,
    private navController: NavController,
    private nfcDiviceService: NfcDiviceService,
    private identityGate: IdentityGateService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('appPassaparola_user')!);
    this.getWallets();
    this.getWins();
    this.getDrawingtWallet();
    this.getNfcDivices();
    this.myWalletWatch();
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.getWallets();
      this.getWins();
      this.getDrawingtWallet();
      this.getNfcDivices();
      event.target.complete();
    }, 1000);
  }

  // ionViewDidEnter() {
  //   this.getWallets();
  //   this.getWins();
  //   this.getDrawingtWallet();
  // }

  ngOnDestroy() {
    this.subscriptionMyWallet?.unsubscribe();
  }

  getWallets() {
    this.walletService.findWalletsByUserId(this.user.userID!).subscribe({
      next: (response) => {
        this.wallets = response;
        this.getDefaultWallet();
      },
    });
  }

  getDefaultWallet() {
    // const wallet = localStorage.getItem('walletSelected');
    // if (wallet) {
    //   this.wallet = JSON.parse(wallet);
    //   return;
    // }
    const defaultWallet = this.wallets.find((wallet) => wallet.default);
    this.wallet = defaultWallet ? defaultWallet : this.wallets[0];
    localStorage.setItem('walletSelected', JSON.stringify(this.wallet));
  }

  getWins() {
    this.walletService.findWinsByUserId(this.user.userID!).subscribe({
      next: (respose) => {
        this.wins = respose.wins;
        this.totalWins = respose.totalWins;
      },
    });
  }

  getDrawingtWallet() {
    this.walletService.findDrawingtWallet().subscribe({
      next: (respose) => {
        this.walletDrawing = respose;
      },
    });
  }

  async modalAction() {
    const modal = await this.modalController.create({
      component: ActionsComponent,
      cssClass: 'modal-60vh',
      backdropDismiss: true,
      componentProps: { walletFrom: this.wallet },
    });
    await modal.present();
  }

  async modalReceive() {
    const modal = await this.modalController.create({
      component: ReceiveModalComponent,
      cssClass: 'modal-60vh',
      backdropDismiss: true,
      componentProps: { walletFrom: this.wallet },
    });
    await modal.present();
  }

  async modalMovements() {
    const modal = await this.modalController.create({
      component: MovementsComponent,
      backdropDismiss: true,
      componentProps: { wallet: this.wallet },
      cssClass: 'modal-full-screen',
    });
    await modal.present();
  }

  myWalletWatch() {
    this.subscriptionMyWallet = this.walletService
      .myWalletWatch()
      .subscribe((wallet: Wallet) => {
        if (!wallet) return;
        this.wallet = wallet;
        this.getWins();
        this.getDrawingtWallet();
      });
  }

  async modalWithdraw() {
    const verified = await this.identityGate.check();
    if (!verified) return;
    const modal = await this.modalController.create({
      component: WithdrawComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { wallet: this.wallet },
    });
    await modal.present();
  }

  async modalTest() {
    const modal = await this.modalController.create({
      component: RechargeSuccesfullyComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { wallet: this.wallet },
    });
    await modal.present();
  }

  async modalOptionsRecharge() {
    const modal = await this.modalController.create({
      component: OptionsRechargeComponent,
      cssClass: 'modal-60vh',
      backdropDismiss: true,
      componentProps: { wallet: this.wallet },
    });
    await modal.present();
  }

  async modalQrCode() {
    const modal = await this.modalController.create({
      component: QrCodeComponent,
      backdropDismiss: true,
      componentProps: {
        data: `${this.wallet.userId}-${this.wallet.prog}`,
        wallet: this.wallet,
      },
    });
    await modal.present();
  }

  async modalMyWallets() {
    this.showModalWallets = true;
    const modal = await this.modalController.create({
      component: MyWalletsComponent,
      cssClass: 'modal-100vh',
      backdropDismiss: true,
      componentProps: { wallets: this.wallets, wallet: this.wallet },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    this.showModalWallets = false;
    if (!data) return;
    this.wallet = data.wallet;
  }

  async modalCashBackMovements() {
    const modal = await this.modalController.create({
      component: MovCashBackComponent,
      backdropDismiss: true,
      componentProps: { wallet: this.wallet },
      cssClass: 'modal-full-screen',
    });
    await modal.present();
  }

  async modalWithdrawRewards() {
    const modal = await this.modalController.create({
      component: WithdrawRewardsComponent,
      backdropDismiss: true,
      componentProps: { wallet: this.wallet },
      cssClass: 'modal-full-screen',
    });
    await modal.present();
  }

  goToAddNFC() {
    this.navController.navigateForward(['pages/add-nfc']);
  }

  getNfcDivices() {
    this.nfcDiviceService.findAllByuser().subscribe({
      next: (response) => {
        this.nfcDivices = response;
      },
    });
  }
}
