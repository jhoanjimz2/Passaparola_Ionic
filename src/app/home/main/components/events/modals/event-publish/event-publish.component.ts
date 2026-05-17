import { Component }       from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-event-publish',
  templateUrl: './event-publish.component.html',
  styleUrls: ['./event-publish.component.scss'],
})
export class EventPublishComponent {

  constructor(private modalController: ModalController) {}

  closeModal() {
    this.modalController.dismiss();
  }

  publishEvent() {
    this.modalController.dismiss({data: true});
  }
}
