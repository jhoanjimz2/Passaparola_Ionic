import { Component, OnInit } from '@angular/core';
// import { User } from '@capacitor-firebase/authentication';
import { ModalController } from '@ionic/angular';
import { switchMap } from 'rxjs';
import { ScanQrComponent } from 'src/app/components/scan-qr/scan-qr.component';
import { Company } from 'src/app/shared/interfaces/company/company.interface';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import {
  CompanyService,
  UserService,
  WalletService,
} from 'src/app/shared/services';

@Component({
  selector: 'app-tpv-recharges',
  templateUrl: './tpv.component.html',
  styleUrls: ['./tpv.component.scss'],
})
export class TpvComponent implements OnInit {
  amount = '0';
  decimalAmount = '00';
  mainAmount = '0';
  walletFrom: Wallet = {} as Wallet;
  isBusiness = false;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

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

  goScanQr() {
    if (parseFloat(this.mainAmount) <= 0) return;

    this.modalController.dismiss({
      amount: this.amount,
      mainAmount: this.mainAmount,
      decimalAmount: this.decimalAmount,
    });
  }
}
