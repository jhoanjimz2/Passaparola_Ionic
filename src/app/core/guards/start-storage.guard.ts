import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class StartStorageGuard {
  constructor(private navController: NavController) {}

  canActivate() {
    if (localStorage.getItem('appPassaparola_start')) {
      return true;
    } else {
      this.navController.navigateRoot(['start']);
      return false;
    }
  }
}
