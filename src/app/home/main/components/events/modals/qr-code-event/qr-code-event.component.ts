import { Component, Input, OnChanges } from '@angular/core';
import { Events }                      from 'src/app/shared/interfaces/events/events';
import { SeatViewImageComponent }      from '../seat/seat-view-image/seat-view-image.component';
import { ModalController }             from '@ionic/angular';

@Component({
  selector: 'app-qr-code-event',
  templateUrl: './qr-code-event.component.html',
  styleUrls: ['./qr-code-event.component.scss'],
})
export class QrCodeEventComponent  implements OnChanges {
  @Input() event:Events = {} as Events;

  constructor(
    private modalController: ModalController
  ) {}

  ngOnChanges() {
  }

  async seatOpenViewImage(imgGallery: string) {
    const modal = await this.modalController.create({
      component: SeatViewImageComponent,
      cssClass: 'bg-transp',
      componentProps: { imgGallery }
    });
    modal.present();
  }

}
