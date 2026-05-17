import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AssingSuccessfulComponent } from '../assing-successful/assing-successful.component';
import { PassaparolaCard } from 'src/app/shared/interfaces/passaparolaCard/passaparola-card.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import {
  CommunityService,
  UserService,
  WalletService,
} from 'src/app/shared/services';
import { switchMap } from 'rxjs';
import { Country } from 'src/app/shared/interfaces/country/country.interface';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  @Input() passaparolaCard: PassaparolaCard = {} as PassaparolaCard;
  cardNumber = '';
  @Input() prefix = '';
  @Input() phoneNumber = '';
  @Input() user: User = {} as User;
  @Input() idCountry = '';

  constructor(
    private modalController: ModalController,
    private userService: UserService,
    private walletService: WalletService,
    private communityService: CommunityService
  ) {}

  ngOnInit() {}

  formattcardNumber(number: string) {
    return number.replace(/(.{4})/g, '$1 ');
  }

  async modalSuccess() {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: AssingSuccessfulComponent,
      cssClass: 'modal-100vh',
      backdropDismiss: true,
      componentProps: {
        cardNumber: this.passaparolaCard.cardNumber,
        prefix: this.prefix,
        phoneNumber: this.phoneNumber,
      },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
  }

  createUser() {
    const user: User = {
      phoneNumber: this.phoneNumber,
      countryID: this.idCountry,
      rol: 'user',
      promoCode: '',
    };

    this.userService
      .createUser(user)
      .pipe(
        switchMap((userResponse) => {
          this.user = userResponse;
          return this.walletService.createWallet({
            userId: userResponse.userID!,
            status: true,
            countryCode: this.user.country?.code,
          });
        })
      )
      .pipe(
        switchMap(() => {
          return this.communityService.createCommunity({
            status: true,
            countryCode: this.user.country?.code!,
            userId: this.user.userID!,
            promoCode: this.user.promoCode,
          });
        })
      )
      .subscribe({
        next: () => {
          this.assingCard();
        },
      });
  }

  assingCard() {
    this.walletService
      .assingPassaparolaCard(
        this.user.userID!,
        this.passaparolaCard.id,
        this.user.country?.code!
      )
      .subscribe({
        next: () => {
          this.modalSuccess();
        },
      });
  }

  confirm() {
    if (this.user.id) {
      this.assingCard();
      return;
    }
    this.createUser();
  }
}
