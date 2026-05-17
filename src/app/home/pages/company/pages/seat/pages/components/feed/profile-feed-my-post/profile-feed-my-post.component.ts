import { CommonModule }                                          from '@angular/common';
import { Component, Input, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { NgxMasonryComponent, NgxMasonryModule }                 from 'ngx-masonry';
import { SocialTag }                                             from 'src/app/shared/interfaces/social/social-post';
import { PostFeedComponent }                                     from '../../post/post-feed/post-feed.component';

@Component({
  selector: 'app-profile-feed-my-post',
  templateUrl: './profile-feed-my-post.component.html',
  styleUrls: ['./profile-feed-my-post.component.scss'],
  imports: [
    CommonModule,
    NgxMasonryModule,
    PostFeedComponent
  ],
  standalone: true
})
export class ProfileFeedMyPostComponent implements OnChanges {
  @ViewChild('masonryFeed') masonryFeed!: NgxMasonryComponent;
  @Input() myPosts: SocialTag[] = [];
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

