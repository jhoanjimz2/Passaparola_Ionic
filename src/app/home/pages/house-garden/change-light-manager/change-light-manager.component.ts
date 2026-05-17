import { Component }                                  from '@angular/core';
import { IonContent, AlertController, NavController } from '@ionic/angular/standalone';
import { HeaderComponent }                            from './components/header/header.component';
import { StepComponent }                              from './components/step/step.component';
import { CommonModule }                               from '@angular/common';
import { FormContractHolderComponent }                from './components/form-contract-holder/form-contract-holder.component';
import { FormDeliveryAddressComponent }               from "./components/form-delivery-address/form-delivery-address.component";
import { FormPaymentMethodComponent }                 from "./components/form-payment-method/form-payment-method.component";
import { FormSupplyContractComponent }                from "./components/form-supply-contract/form-supply-contract.component";
import { ConfirmRequestComponent }                    from './components/confirm-request/confirm-request.component';
import { BankAccountService }                         from 'src/app/shared/services/bank-account.service';
import { IBankAccount, IResponseBankAccount }         from 'src/app/shared/interfaces/bank-account/bank-account.interface';
import { IResponseBankCard }                          from 'src/app/shared/interfaces/bank-card/bank-card.interface';
import { StripeService }                              from 'src/app/shared/services';
import { map, switchMap }                             from 'rxjs';
import { BankCardService }                            from 'src/app/shared/services/bank-card.service';
import { Contract }                                   from 'src/app/shared/interfaces/contract/contract';
import { HomeGardenService }                          from 'src/app/shared/services/home-garden.service';

@Component({
  selector: 'app-change-light-manager',
  templateUrl: './change-light-manager.component.html',
  styleUrls: ['./change-light-manager.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    HeaderComponent,
    StepComponent,
    FormContractHolderComponent,
    FormDeliveryAddressComponent,
    FormPaymentMethodComponent,
    FormSupplyContractComponent,
    ConfirmRequestComponent
  ]
})
export class ChangeLightManagerComponent {
  currentStep: number = 1;
  totalSteps: number = 4;
  confirmRequest = false;

  bankWallet: any = [];
  bankCards: any = [];
  bankAccounts: IBankAccount[] = [];

  contract: Contract = {} as Contract;

  constructor(
    private alertController: AlertController,
    private navController: NavController,
    private bankAccountService: BankAccountService,
    private bankCardService: BankCardService,
    private stripeService: StripeService,
    private homeGardenService: HomeGardenService
  ) {
    this.findAllWallet();
    this.findAllBank();
    this.findAllCard();
  }

  onStepChange(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  async onBackPressed(): Promise<void> {
    if (this.currentStep === 4 && this.confirmRequest) {
      this.navController.back();
    }

    if (this.currentStep > 1) {
      this.currentStep--;
    } else {
      await this.showExitConfirmation();
    }
  }

  private async showExitConfirmation(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Conferma uscita',
      message: 'Sei sicuro di voler uscire dal modulo? Tutti i dati non salvati andranno persi.',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel'
        },
        {
          text: 'Ok',
          role: 'confirm',
          handler: () => {
            this.navController.back();
          }
        }
      ]
    });

    await alert.present();
  }

  save_data(event:any) {
    this.onStepChange(event.step)

    this.contract = {
      ...this.contract,
      ...event?.data
    }

    if (event?.loadService) {
      this.homeGardenService.request(this.contract).subscribe({
        next: () => {
          this.confirmRequest = true;
        }
      })
    }

  }


  findAllWallet() {
    const walletSelected = JSON.parse(localStorage.getItem('walletSelected')!)
    this.bankWallet = {
      wallet: walletSelected.userId
    }
  }


  findAllBank() {
    this.bankAccountService
      .findAll({
        filterUser: true,
        offset: 1,
        limit: 1000,
      })
      .subscribe(({ data, metadata }: IResponseBankAccount) => {
        this.bankAccounts = data;
        console.log(data)
      });
  }
  findAllCard() {
    this.bankCardService
    .findAll({
      filterUser: true,
      offset: 1,
      limit: 1000,
    }).pipe(
      switchMap(({ data }: IResponseBankCard) => {
        const customerIds = data.map(card => card.idStripe);
        return this.stripeService.getPaymentMethods(customerIds);
      }),
      map(response =>
        response.flatMap(data =>
          data.data.map(card => ({
            id: card.id,
            brand: card.card.brand,
            cardNumber: `0000 0000 0000 ${card.card.last4}`,
            expiration: `${card.card.exp_month}/${card.card.exp_year.toString().slice(-2)}`,
            owner: card.billing_details.name,
            customer: card.customer,
          }))
        )
      )
    )
    .subscribe(bankCards => {
      this.bankCards = bankCards;
      console.log(bankCards)
    });
  }

}
