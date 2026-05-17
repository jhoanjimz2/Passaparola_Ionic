import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProfileFeedMenuComponent }               from '../profile-feed-menu/profile-feed-menu.component';
import { ProfileFeedMyPostComponent }             from '../profile-feed-my-post/profile-feed-my-post.component';
import { ProfileFeedLikesComponent }              from '../profile-feed-likes/profile-feed-likes.component';
import { ProfileFeedSavedsComponent }             from '../profile-feed-saveds/profile-feed-saveds.component';
import { SocialTag }                              from 'src/app/shared/interfaces/social/social-post';
import { ProfileFeedTagsComponent }               from '../profile-feed-tags/profile-feed-tags.component';

@Component({
  selector: 'app-profile-feed',
  templateUrl: './profile-feed.component.html',
  styleUrls: ['./profile-feed.component.scss'],
  standalone: true,
  imports: [
    ProfileFeedMenuComponent,
    ProfileFeedMyPostComponent,
    ProfileFeedLikesComponent,
    ProfileFeedSavedsComponent,
    ProfileFeedTagsComponent
  ]
})
export class ProfileFeedComponent {
  @Output() selectTabFeed = new EventEmitter<string>();
  @Input() postsFeedLikes: SocialTag[] = [];
  @Input() myPosts: SocialTag[] = [];
  @Input() postsFeedSaveds: SocialTag[] = [];
  @Input() isPublic: boolean = false;
  tabFeed: string = 'feed';

  setTabFeed(tab: string) {
    this.tabFeed = tab;
    this.selectTabFeed.emit(tab);
  }
}
