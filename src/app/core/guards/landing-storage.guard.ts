import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LandingStorageGuard {
  constructor(private navController: NavController) {}

  canActivate() {
    if (localStorage.getItem('appPassaparola_landing')) {
      return true;
    } else {
      this.navController.navigateRoot(['landing']);
      return false;
    }
  }
}
