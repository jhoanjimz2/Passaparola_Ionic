import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from 'src/app/shared/interfaces/user/user.interface';
import { CryptoService } from '../../shared/services/crypto.service';
import { UserService } from 'src/app/shared/services';
import { ModalController } from '@ionic/angular';
import { ModalWelcomeComponent } from 'src/app/components/modal-welcome/modal-welcome.component';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.page.html',
  styleUrls: ['./sing-up.page.scss'],
})
export class SingUpPage implements OnInit {
  user: User = {} as User;
  phone = '';
  phonePrefix = '';
  codeCountry = '';
  constructor(
    private route: ActivatedRoute,
    private cryptoService: CryptoService,
    private userSerice: UserService,
    private modalController: ModalController
  ) {}
  async ngOnInit() {
    // this.checkWelcomeStatus();
    // this.user.id = '5521e37e-51ff-487a-abaa-ba477da0ba76';
    // this.user.userID = 'ES00000000000001';
    // this.user.pinActive = true;

    this.route.queryParams.subscribe(async (params: any) => {
      const promoCode = params.promoCode;
      this.phone = params.phone;
      this.phonePrefix = params.phonePrefix;
      this.codeCountry = params.codeCountry;

      if (!promoCode) return;

      const promoCodeDecrypt = await this.cryptoService.decrypt(promoCode);
      if (!promoCodeDecrypt) return;
      this.checkPromoCode(promoCodeDecrypt);
    });
  }

  getUser(ev: User) {
    this.user = ev;
  }

  checkPromoCode(promoCode: string) {
    this.userSerice.checkPromoCode(promoCode).subscribe({
      next: () => {
        this.user.promoCode = promoCode;
      },
    });
  }

  async checkWelcomeStatus() {
    const welcome = localStorage.getItem('passaparola_welcome');
    if (!welcome) {
      const modal = await this.modalController.create({
        component: ModalWelcomeComponent,
        cssClass: 'modal-full-screen',
        backdropDismiss: false,
      });
      await modal.present();
      localStorage.setItem('passaparola_welcome', 'true');
    }
  }
}
