import { CommonModule }                                          from '@angular/common';
import { Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { IonicModule }                                           from '@ionic/angular';
import { NgxMasonryComponent, NgxMasonryModule }                 from 'ngx-masonry';
import { SocialTag }                                             from 'src/app/shared/interfaces/social/social-post';
import { PostFeedComponent }                                     from '../../post/post-feed/post-feed.component';

@Component({
  selector: 'app-profile-feed-saveds',
  templateUrl: './profile-feed-saveds.component.html',
  styleUrls: ['./profile-feed-saveds.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    NgxMasonryModule,
    PostFeedComponent
  ],
  standalone: true
})
export class ProfileFeedSavedsComponent implements OnChanges {
  @ViewChild('masonryFeed') masonryFeed!: NgxMasonryComponent;
  @Input() postsFeedSaveds: SocialTag[] = [];
  @Input() isPublic: boolean = false;
  @Input() active = false;

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

