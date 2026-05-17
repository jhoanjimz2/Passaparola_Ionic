import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import { WalletService } from 'src/app/shared/services';

@Component({
  selector: 'app-my-wallets',
  templateUrl: './my-wallets.component.html',
  styleUrls: ['./my-wallets.component.scss'],
})
export class MyWalletsComponent implements OnInit {
  @Input() wallet: Wallet = {} as Wallet;
  walletSelected: Wallet = {} as Wallet;
  @Input() wallets: Wallet[] = [];

  constructor(
    private modalController: ModalController,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    this.walletSelected = this.wallet;
  }

  close(sendData: boolean) {
    if (!sendData) {
      this.modalController.dismiss();
      return;
    }
    this.walletService.myWalletSet(this.walletSelected);
    this.modalController.dismiss({ wallet: this.walletSelected });
  }
}
