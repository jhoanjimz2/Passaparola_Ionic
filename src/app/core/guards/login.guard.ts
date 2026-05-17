import { Injectable } from '@angular/core';

import { AuthenticationService } from '../service/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard {
  constructor(private authenticationService: AuthenticationService) {}
  canActivate() {
    if (this.authenticationService.isLoged()) {
      return true;
    }

    setTimeout(() => this.authenticationService.logout(), 0);

    return false;
  }
}
