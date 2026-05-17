import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
import { IResponseBankCard } from 'src/app/shared/interfaces/bank-card/bank-card.interface';
import { StripeService } from 'src/app/shared/services';
import { BankCardService } from 'src/app/shared/services/bank-card.service';

@Component({
  selector: 'app-bank-card-list',
  templateUrl: './bank-card-list.page.html',
  styleUrls: ['./bank-card-list.page.scss'],
})
export class BankCardListPage implements OnInit {
  bankCards: any = [];
  bankCardsDB: any = [];

  constructor(
    private translate: TranslateService,
    private stripeService: StripeService,
    private bankCardService: BankCardService,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.findAll();
  }

  findAll() {
    this.bankCardService
      .findAll({
        filterUser: true,
        offset: 1,
        limit: 1000,
      })
      .subscribe(({ data }: IResponseBankCard) => {
        this.bankCardsDB = data;

        const customerIds: string[] = data.map((card) => {
          return card.idStripe;
        });

        this.stripeService.getPaymentMethods(customerIds).subscribe({
          next: (response) => {
            let bankCards: any = [];
            response.forEach((data) => {
              bankCards = [
                ...bankCards,
                ...data.data.map((card: any) => {
                  return {
                    brand: card.card.brand,
                    cardNumber: `0000 0000 0000 ${card.card.last4}`,
                    expiration: `${card.card.exp_month}/${card.card.exp_year
                      .toString()
                      .slice(-2)}`,
                    owner: card.billing_details.name,
                    customer: card.customer,
                  };
                }),
              ];
            });
            this.bankCards = bankCards;
          },
        });
      });
  }

  async onDelete(idStripe: string) {
    const { id } = this.bankCardsDB.find(
      (card: any) => card.idStripe === idStripe
    );

    const alert = await this.alertController.create({
      header: this.translate.instant('BANK_CARD.DELETE'),
      mode: 'ios',
      message: this.translate.instant(`BANK_CARD.DELETE_MSG`),
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
            this.bankCardService.delete(id).subscribe((response: any) => {
              this.bankCardsDB = this.bankCardsDB.filter(
                (bankCard: any) => bankCard.idStripe !== id
              );

              this.bankCards = this.bankCards.filter(
                (bankCard: any) => bankCard.customer !== idStripe
              );
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
