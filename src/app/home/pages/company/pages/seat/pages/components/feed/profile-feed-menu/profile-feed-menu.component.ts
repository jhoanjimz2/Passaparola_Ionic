
import { CommonModule }                           from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController }                        from '@ionic/angular';
import { IonIcon }                                from '@ionic/angular/standalone';
import { ModalActionNotValidComponent }           from 'src/app/components/modal-action-not-valid/modal-action-not-valid.component';

@Component({
  selector: 'app-profile-feed-menu',
  templateUrl: './profile-feed-menu.component.html',
  styleUrls: ['./profile-feed-menu.component.scss'],
  imports: [
    CommonModule,
    IonIcon
  ],
  standalone: true
})
export class ProfileFeedMenuComponent {
  @Output() selectTabFeed = new EventEmitter<string>();
  @Input() isPublic: boolean = false;
  tabFeed: string = 'feed';

  constructor(
    private modalCtrl: ModalController
  ) {}


  setTabFeed(tab: string) {
    if (this.isPublic) {
      this.actionNotValid()
      return;
    }
    this.tabFeed = tab;
    this.selectTabFeed.emit(tab);
  }

  async actionNotValid(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModalActionNotValidComponent,
      cssClass: 'bg-transp'
    });
    await modal.present();
  }
}
