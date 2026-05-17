import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import {
  IBankAccount,
  IResponseBankAccount,
} from 'src/app/shared/interfaces/bank-account/bank-account.interface';
import { BankAccountService } from 'src/app/shared/services/bank-account.service';

@Component({
  selector: 'app-bank-account-list',
  templateUrl: './bank-account-list.page.html',
  styleUrls: ['./bank-account-list.page.scss'],
})
export class BankAccountListPage implements OnInit {
  bankAccounts: IBankAccount[] = [];
  infiniteScrollEnabled = false;
  limit = 10;
  page = 1;

  constructor(
    private bankAccountService: BankAccountService,
    private translate: TranslateService,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.bankAccounts = [];
    this.findAll();
  }

  findAll(event?: any) {
    this.bankAccountService
      .findAll({
        filterUser: true,
        offset: this.page,
        limit: this.limit,
      })
      .subscribe(({ data, metadata }: IResponseBankAccount) => {
        this.bankAccounts.push(...data);

        this.bankAccounts = this.sortItemsByFavorite([...this.bankAccounts]);
      });
  }

  async onDelete(id: string) {
    const alert = await this.alertController.create({
      header: this.translate.instant('BANK_ACCOUNT.DELETE'),
      mode: 'ios',
      message: this.translate.instant(`BANK_ACCOUNT.DELETE_MSG`),
      buttons: [
        {
          text: this.translate.instant('GENERAL.NO'),
          role: 'cancel',
          cssClass: 'botonAlert',
          handler: () => {},
        },
        {
          text: this.translate.instant('GENERAL.YES'),
          cssClass: 'botonAlert',
          handler: () => {
            this.bankAccountService.delete(id).subscribe((response: any) => {
              this.bankAccounts = this.bankAccounts.filter(
                (bankAccount) => bankAccount.id !== id
              );

              this.bankAccounts = this.sortItemsByFavorite([
                ...this.bankAccounts,
              ]);
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async onFavorite(id: string, isFavorite: boolean) {
    if (isFavorite) return;

    const alert = await this.alertController.create({
      header: this.translate.instant('BANK_ACCOUNT.PREFERRED'),
      mode: 'ios',
      message: this.translate.instant(`BANK_ACCOUNT.PREFERRED_MSG`),
      buttons: [
        {
          text: this.translate.instant('GENERAL.NO'),
          role: 'cancel',
          cssClass: 'botonAlert',
          handler: () => {},
        },
        {
          text: this.translate.instant('GENERAL.YES'),
          cssClass: 'botonAlert',
          handler: () => {
            this.bankAccountService.favorite(id).subscribe((response: any) => {
              this.bankAccounts = this.bankAccounts.map((bankAccount) => {
                return {
                  ...bankAccount,
                  isFavorite: bankAccount.id === id ? true : false,
                };
              });

              this.bankAccounts = this.sortItemsByFavorite([
                ...this.bankAccounts,
              ]);
            });
          },
        },
      ],
    });
    await alert.present();
  }

  sortItemsByFavorite(bankAccounts: IBankAccount[]) {
    bankAccounts.sort((a: any, b: any) => {
      if (a.isFavorite === b.isFavorite) {
        return 0;
      } else if (a.isFavorite) {
        return -1;
      } else {
        return 1;
      }
    });

    return bankAccounts;
  }
}
