import { CommonModule }                                          from '@angular/common';
import { Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { NgxMasonryComponent, NgxMasonryModule }                 from 'ngx-masonry';
import { SocialTag }                                             from 'src/app/shared/interfaces/social/social-post';
import { PostFeedComponent }                                     from '../../post/post-feed/post-feed.component';

@Component({
  selector: 'app-profile-feed-likes',
  templateUrl: './profile-feed-likes.component.html',
  styleUrls: ['./profile-feed-likes.component.scss'],
  imports: [
    CommonModule,
    NgxMasonryModule,
    PostFeedComponent
  ],
  standalone: true
})
export class ProfileFeedLikesComponent implements OnChanges {
  @ViewChild('masonryFeed') masonryFeed!: NgxMasonryComponent;
  @Input() postsFeedLikes: SocialTag[] = [];
  @Input() active = false;
  @Input() isPublic: boolean = false;

  masonryOptions = {
    itemSelector: '.masonry-item',
    columnWidth: '.grid-sizer',
    percentPosition: true,
    horizontalOrder: true,
    imagesLoaded: true
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (this.active) {
      setTimeout(() => this.masonryFeed.layout(), 100);
    }
  }
  onVideoLoaded() {
    this.masonryFeed?.layout();
  }
}
