import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-bs-suggest-information-step4',
  templateUrl: './bs-suggest-information-step4.component.html',
  styleUrls: ['./bs-suggest-information-step4.component.scss'],
})
export class BsSuggestInformationStep4Component {
  constructor(private modalController: ModalController) {}

  onGoToHome() {
    this.modalController.dismiss({ goHome: true });
  }

  onGoToYourSuggestions() {
    this.modalController.dismiss({
      goToYourSuggestions: true,
    });
  }
}
