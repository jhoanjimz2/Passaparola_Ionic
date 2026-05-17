import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Position, Geolocation } from '@capacitor/geolocation';
import { ModalController } from '@ionic/angular';

import { MapViewPage } from 'src/app/home/map/components/map-view/map-view.page';

@Component({
  selector: 'app-map-wallet',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Input() position: Position = {} as Position;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['position']) {
      this.position = changes['position']['currentValue'];
    }
  }

  async goToMap() {
    const modal = await this.modalController.create({
      component: MapViewPage,
      backdropDismiss: true,
      cssClass: 'modal-full-screen',
    });
    await modal.present();
  }
}
