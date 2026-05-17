import { Component, OnInit } from '@angular/core';
import { ModalController }   from '@ionic/angular';

@Component({
  selector: 'app-pending-event-private',
  templateUrl: './pending-event-private.component.html',
  styleUrls: ['./pending-event-private.component.scss'],
})
export class PendingEventPrivateComponent  implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss()
  }

}
