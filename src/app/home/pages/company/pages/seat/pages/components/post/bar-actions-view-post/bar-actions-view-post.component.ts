// bar-actions-view-post.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController }                        from '@ionic/angular';
import { IonIcon }                                from '@ionic/angular/standalone';
import { ViewPostTagsComponent }                  from '../view-post-tags/view-post-tags.component';
import { SocialTag }                              from 'src/app/shared/interfaces/social/social-post';
import { NumberFormatPipe }                       from 'src/app/shared/pipes/number-format.pipe';
import { CommonModule }                           from '@angular/common';

@Component({
  selector: 'app-bar-actions-view-post',
  templateUrl: './bar-actions-view-post.component.html',
  styleUrls: ['./bar-actions-view-post.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    NumberFormatPipe
  ]
})
export class BarActionsViewPostComponent {
  @Output() clickButton: EventEmitter<string> = new EventEmitter<string>();
  @Input() post: SocialTag = {} as SocialTag;
  @Input() statusLike: boolean = false;
  @Input() statusSave: boolean = false;
  @Input() isAnimating: boolean = false;
  @Input() isDisappearing: boolean = false;

  constructor(
    private modalCtrl: ModalController
  ) {}


  async openViewPostTags() {
    const modal = await this.modalCtrl.create({
      component: ViewPostTagsComponent,
      componentProps: {
        post: this.post
      },
      cssClass: ['radius-modals', 'modal-60vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    modal.present();
  }

  likeDislike() {
    this.clickButton.emit('like-dislike')
  }
  saveUnSave() {
    this.clickButton.emit('save-unsave')
  }
  shareUnShare() {
    this.clickButton.emit('share-unshare')
  }
  get amountLikes() {
    return this.post?.likes?.filter(like => like.status).length;
  }
  get amountViews() {
    return this.post?.views?.filter(view => view.status).length;
  }
  get amountSaves() {
    return this.post?.saves?.filter(save => save.status).length;
  }
  get amountShares() {
    return this.post?.shares?.filter(share => share.status).length;
  }
}
