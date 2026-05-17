import { Injectable } from '@angular/core';

import { AuthenticationService } from '../service/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class CheckTokenGuard {
  constructor(private authenticationService: AuthenticationService) {}

  async canActivate() {
    if (this.authenticationService.checkTokenLogin()) {
      const appPassaparola_userToken = localStorage.getItem(
        'appPassaparola_userToken'
      );
      const checkToken = await this.veryfyPassaparolaTokenRenew(
        appPassaparola_userToken!
      );

      if (!checkToken) {
        setTimeout(() => this.authenticationService.logout(), 0);
      }

      return checkToken;
    }
    return false;
  }

  veryfyPassaparolaTokenRenew(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let payload = JSON.parse(atob(token.split('.')[1]));
      let tokenExp = new Date(payload.exp * 1000);
      let nowDate = new Date();
      nowDate.setTime(nowDate.getTime() + 0.01 * 60 * 60 * 1000);
      if (tokenExp.getTime() > nowDate.getTime()) {
        resolve(true);
      } else {
        this.authenticationService.renewTokenPassaparola().subscribe({
          next: () => resolve(true),
          error: () => {
            resolve(false);
          },
        });
      }
    });
  }
}
