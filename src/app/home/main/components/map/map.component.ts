import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Position, Geolocation } from '@capacitor/geolocation';
import { ModalController } from '@ionic/angular';

import { MapViewPage } from 'src/app/home/map/components/map-view/map-view.page';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  @Input() position: Position = {} as Position;

  constructor(private modalController: ModalController) {}
  ngOnDestroy(): void {}

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
      componentProps: {
        showHeader: true,
        returnModal: 'MapViewPage',
      },
    });
    await modal.present();
  }
}
