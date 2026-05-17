import { Component, Input, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { ModalController } from '@ionic/angular';

import { ModalRedirectInfoComponent } from '../modal-redirect-info/modal-redirect-info.component';

@Component({
  selector: 'app-online-store-card',
  templateUrl: './online-store-card.component.html',
  styleUrls: ['./online-store-card.component.scss'],
})
export class OnlineStoreCardComponent implements OnInit {
  @Input() stores: any[] = [];
  @Input() showTitle = true;
  @Input() keyword = '';

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async openStore(url: string) {
    if (!url) return;
    const modal = await this.modalController.create({
      component: ModalRedirectInfoComponent,
      cssClass: 'modal-full-screen',
      componentProps: { url },
    });
    await modal.present();
  }

  // async openStore(url: string) {
  //   if (!url) return;

  //   await Browser.open({ url });
  // }
}
