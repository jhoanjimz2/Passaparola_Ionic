import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { switchMap } from 'rxjs';

import { KeyboardAtmComponent } from 'src/app/components/keyboard-atm/keyboard-atm.component';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import {
  CompanyService,
  UserService,
  WalletService,
} from 'src/app/shared/services';
import { TransferComponent } from '../transfer/transfer.component';
import { Contact } from 'src/app/shared/interfaces/contact/contact.interface';
import { Company } from 'src/app/shared/interfaces/company/company.interface';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';

@Component({
  selector: 'app-wallet-id',
  templateUrl: './wallet-id.component.html',
  styleUrls: ['./wallet-id.component.scss'],
})
export class WalletIDComponent implements OnInit {
  formUserID: FormGroup = {} as FormGroup;
  userTo: User = {} as User;
  companyTo: Company = {} as Company;
  @Input() walletFrom: Wallet = {} as Wallet;
  walletTo: Wallet = {} as Wallet;
  isBussines = false;

  constructor(
    private formBuild: FormBuilder,
    private userService: UserService,
    private modalController: ModalController,
    private walletService: WalletService,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.formUserID = this.formBuild.group({
      userID: new FormControl('', [Validators.required]),
    });
  }

  getWalletByUserIdAndProg() {
    const code = this.formUserID.controls['userID'].value;
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
      .subscribe((response) => {
        this.modalController.dismiss();
        if (this.isBussines) this.companyTo = response as Company;
        if (!this.isBussines) this.userTo = response as User;
        this.modalKeyboard();
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
    if (!data) return;
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
}
