import { Component }             from '@angular/core';
import { RouterLink }            from '@angular/router';
import { ModalController }       from '@ionic/angular';
import { IonContent, IonIcon }   from "@ionic/angular/standalone";
import { ComponentModule }       from 'src/app/components/component.module';
import { ModalPreviewComponent } from '../modal-preview/modal-preview.component';

@Component({
  selector: 'app-house-garden-index',
  templateUrl: './house-garden-index.component.html',
  styleUrls: ['./house-garden-index.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonContent,
    ComponentModule,
    RouterLink
  ]
})
export class HouseGardenIndexComponent {


  constructor(
    private modalCtrl: ModalController
  ) {}

  async openPreview(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModalPreviewComponent,
      backdropDismiss: true,
      cssClass: 'modal-45vh',
    });
    await modal.present();
  }
}
