import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoginStorageGuard {
  constructor(private navController: NavController) {}

  canActivate() {
    if (localStorage.getItem('appPassaparola_login')) {
      return true;
    } else {
      this.navController.navigateRoot(['start']);
      return false;
    }
  }
}
