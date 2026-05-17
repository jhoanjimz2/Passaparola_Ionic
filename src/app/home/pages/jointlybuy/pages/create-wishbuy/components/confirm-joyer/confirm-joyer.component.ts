import { Component }       from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonContent }      from "@ionic/angular/standalone";

@Component({
  selector: 'app-confirm-joyer',
  templateUrl: './confirm-joyer.component.html',
  styleUrls: ['./confirm-joyer.component.scss'],
  standalone: true,
  imports: [
    IonContent
  ]
})
export class ConfirmJoyerComponent {

  constructor(private modalCtrl: ModalController) {}

  confirm() {
    this.modalCtrl.dismiss({ confirmed: true });
  }

}
