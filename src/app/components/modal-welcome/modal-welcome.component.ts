import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InitialOnBoardingComponent } from '../initial-on-boarding/initial-on-boarding.component';

@Component({
  selector: 'app-modal-welcome',
  templateUrl: './modal-welcome.component.html',
  styleUrls: ['./modal-welcome.component.scss'],
})
export class ModalWelcomeComponent implements OnInit {
  image1 = 'assets/images/store.png';

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  close() {
    this.initialOnBoarding();
    this.modalController.dismiss();
  }

  async initialOnBoarding() {
    const modal = await this.modalController.create({
      component: InitialOnBoardingComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: false,
    });
    await modal.present();
  }
}
