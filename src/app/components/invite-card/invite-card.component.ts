import { Component, Input, OnInit } from '@angular/core';
import { Share } from '@capacitor/share';
import { TranslateService } from '@ngx-translate/core';

import { CryptoService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invite-card',
  templateUrl: './invite-card.component.html',
  styleUrls: ['./invite-card.component.scss'],
})
export class InviteCardComponent implements OnInit {
  @Input() image = 'assets/images/invite_2.png';

  constructor(
    private translate: TranslateService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit() {}

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
