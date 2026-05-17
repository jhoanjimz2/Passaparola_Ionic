import { Component }                                   from '@angular/core';
import { CommonModule }                                from '@angular/common';
import { IonicModule, ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-modal-action-not-valid',
  templateUrl: './modal-action-not-valid.component.html',
  styleUrls: ['./modal-action-not-valid.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ModalActionNotValidComponent {

  constructor(
    private modalController: ModalController,
    private navCtrl: NavController
  ) {}

  closeModal() {
    this.modalController.dismiss({
      action: 'cancel'
    });
  }

  goToLogin() {
    this.modalController.dismiss({
      action: 'login'
    });
    this.navCtrl.navigateForward(['/login']);
  }

  goToSignUp() {
    this.modalController.dismiss({
      action: 'signup'
    });
    this.navCtrl.navigateForward(['/sing-up']);
  }
}
