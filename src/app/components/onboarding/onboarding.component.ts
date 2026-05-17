import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {
  constructor(
    private modalContoller: ModalController,
    private navController: NavController
  ) {}

  ngOnInit() {}

  close() {
    this.modalContoller.dismiss();
    this.navController.navigateForward(['pages/profile-info']);
  }
}
