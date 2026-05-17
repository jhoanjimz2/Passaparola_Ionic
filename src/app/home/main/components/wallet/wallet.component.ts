import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ModalController, NavController }                     from '@ionic/angular';

import { Subscription }                                       from 'rxjs';
import { OptionsRechargeComponent }                           from 'src/app/components/options-recharge/options-recharge.component';
import { AcceptAtmSuccessfullyComponent }                     from 'src/app/home/wallet/components/accept-atm-successfully/accept-atm-successfully.component';
import { ActionsComponent }                                   from 'src/app/home/wallet/components/actions/actions.component';
import { MovementsComponent }                                 from 'src/app/home/wallet/components/movements/movements.component';
import { MyWalletsComponent }                                 from 'src/app/home/wallet/components/my-wallets/my-wallets.component';
import { QrCodeComponent }                                    from 'src/app/home/wallet/components/qr-code/qr-code.component';
import { ReceiveModalComponent }                              from 'src/app/home/wallet/components/receive-modal/receive-modal.component';
import { WithdrawComponent }                                  from 'src/app/home/wallet/components/withdraw/withdraw.component';

import { User }                                               from 'src/app/shared/interfaces/user/user.interface';
import { Wallet }                                             from 'src/app/shared/interfaces/wallet/wallet.interface';
import { WalletService }                                      from 'src/app/shared/services';
import { CalendarComponent }                                  from '../calendar/calendar.component';
import { IdentityGateService }                                from 'src/app/shared/services/Identity-gate.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent implements OnInit, OnDestroy {
  showAmount = true;

  wallets: Wallet[] = [];
  wallet: Wallet = {} as Wallet;
  user: User = {} as User;
  walletDrawing: Wallet = {} as Wallet;
  subscriptionMyWallet: Subscription | undefined;
  @Input() refresh: any;
  showModalWallets = false;

  constructor(
    private modalController: ModalController,
    private walletService: WalletService,
    private navController: NavController,
    private identityGate: IdentityGateService
  ) {}

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('appPassaparola_user')!);
    this.getWallets();
    this.getDrawingtWallet();
    this.myWalletWatch();
  }

  ngOnDestroy() {
    this.subscriptionMyWallet?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['refresh'].firstChange) {
      this.getWallets();
      this.getDrawingtWallet();
    }
  }

  getWallets() {
    this.walletService.findWalletsByUserId(this.user.userID!).subscribe({
      next: (response) => {
        this.wallets = response;
        // const defaultWallet = this.wallets.find((wallet) => wallet.default);
        // this.wallet = defaultWallet ? defaultWallet : this.wallets[0];
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
    // const defaultWallet = this.wallets.find((wallet) => wallet.default);
    // this.wallet = defaultWallet ? defaultWallet : this.wallets[0];
    const defaultWallet = this.wallets.find((wallet) => wallet.default);
    this.wallet = defaultWallet ? defaultWallet : this.wallets[0];
    localStorage.setItem('walletSelected', JSON.stringify(this.wallet));
  }

  getDrawingtWallet() {
    this.walletService.findDrawingtWallet().subscribe({
      next: (respose) => {
        this.walletDrawing = respose;
      },
    });
  }

  goToWallet() {
    this.navController.navigateRoot(['wallet']);
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

  async modalTest() {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: AcceptAtmSuccessfullyComponent,
      backdropDismiss: true,
      componentProps: {},
      cssClass: 'modal-accept-atm-success',
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
  }

  myWalletWatch() {
    this.subscriptionMyWallet = this.walletService
      .myWalletWatch()
      .subscribe((wallet: Wallet) => {
        if (!wallet) return;
        this.wallet = wallet;
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
      componentProps: { walletFrom: this.wallet },
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

  async modalCalendar() {
    const modal = await this.modalController.create({
      component: CalendarComponent,
      cssClass: 'modal-calendar',
      backdropDismiss: true,
      componentProps: {},
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
  }
}
