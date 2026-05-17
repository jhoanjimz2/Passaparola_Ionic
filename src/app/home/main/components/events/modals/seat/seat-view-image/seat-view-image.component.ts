import { Component, Input } from '@angular/core';
import { ModalController }  from '@ionic/angular';

@Component({
  selector: 'app-seat-view-image',
  templateUrl: './seat-view-image.component.html',
  styleUrls: ['./seat-view-image.component.scss'],
})
export class SeatViewImageComponent {
  @Input() imgGallery: string = '';

  constructor(
    private modalController: ModalController
  ) {}

  close() {
    this.modalController.dismiss();
  }
}
