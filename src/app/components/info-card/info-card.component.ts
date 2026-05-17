import { Component, Input, OnInit } from '@angular/core';
import { Share } from '@capacitor/share';
import { ModalController, NavController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';

import { CryptoService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss'],
})
export class InfoCardComponent implements OnInit {
  @Input() image = 'assets/images/suggestion-card.svg';
  @Input() action: 'suggestion' | '' = '';

  constructor(
    private translate: TranslateService,
    private cryptoService: CryptoService,
    private navController: NavController,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  exeAction(action: 'suggestion' | '') {
    if (!action) return;
    if (action === 'suggestion') this.bussinesSuggestion();
  }

  bussinesSuggestion() {
    this.modalController.dismiss();
    this.navController.navigateRoot(['map'], {
      queryParams: { businessSuggestion: 'yes' },
    });
  }
  async shareApp() {
    const user = localStorage.getItem('appPassaparola_user');
    const userIdEncrypt = this.cryptoService.encrypt(JSON.parse(user!).userID);
    const url = userIdEncrypt
      ? `${environment.urlRegister}/sing-up?promoCode=${userIdEncrypt}`
      : `${environment.urlRegister}/sing-up`;

    const data = {
      title: 'Passaparola App',
      text: this.translate.instant('GENERAL.TEXT_INVITE'),
      url,
      dialogTitle: 'Passaparola App',
    };
    await Share.share(data);
  }
}
