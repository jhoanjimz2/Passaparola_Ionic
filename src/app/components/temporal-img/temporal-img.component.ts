import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { ModalStartAppComponent } from '../modal-start-app/modal-start-app.component';

@Component({
  selector: 'app-temporal-img',
  templateUrl: './temporal-img.component.html',
  styleUrls: ['./temporal-img.component.scss'],
})
export class TemporalImgComponent implements OnInit {
  @Input() img = '';
  loading = true;
  heightContainer = 0;

  constructor(
    private modalController: ModalController,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.heighPage();
  }

  async modalInfo() {
    return;
    const modal = await this.modalController.create({
      component: ModalStartAppComponent,
      cssClass: 'modal-85vh',
      backdropDismiss: true,
    });
    await modal.present();
  }

  heighPage() {
    this.platform.ready().then(() => {
      const element = document.getElementById('img-bottom')!;
      this.heightContainer =
        // this.platform.height() - 124 - element.getBoundingClientRect().height;
        this.platform.height() - 124;
    });
  }
}
