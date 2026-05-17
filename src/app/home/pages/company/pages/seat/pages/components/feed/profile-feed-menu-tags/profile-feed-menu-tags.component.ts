import { CommonModule }                           from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController }                        from '@ionic/angular';
import { ModalActionNotValidComponent }           from 'src/app/components/modal-action-not-valid/modal-action-not-valid.component';

@Component({
  selector: 'app-profile-feed-menu-tags',
  templateUrl: './profile-feed-menu-tags.component.html',
  styleUrls: ['./profile-feed-menu-tags.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class ProfileFeedMenuTagsComponent {
  @Output() selectMenuTag = new EventEmitter<string>();
  @Input() isPublic = false;
  tabMenuTag: string = 'products';

  constructor(
    private modalCtrl: ModalController
  ) {}

  setMenuTag(tab: string) {
    if (this.isPublic) {
      this.actionNotValid()
      return;
    }
    this.tabMenuTag = tab;
    this.selectMenuTag.emit(tab);
  }

  async actionNotValid(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModalActionNotValidComponent,
      cssClass: 'bg-transp'
    });
    await modal.present();
  }
}
