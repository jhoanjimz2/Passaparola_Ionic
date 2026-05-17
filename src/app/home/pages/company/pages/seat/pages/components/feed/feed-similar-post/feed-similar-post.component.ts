import { Component, Input, OnInit, ViewChild }   from '@angular/core';
import { NgxMasonryComponent, NgxMasonryModule } from 'ngx-masonry';
import { SocialTag }                             from 'src/app/shared/interfaces/social/social-post';
import { PostFeedComponent }                     from '../../post/post-feed/post-feed.component';
import { CommonModule }                          from '@angular/common';

@Component({
  selector: 'app-feed-similar-post',
  templateUrl: './feed-similar-post.component.html',
  styleUrls: ['./feed-similar-post.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgxMasonryModule,
    PostFeedComponent
  ]
})
export class FeedSimilarPostComponent  implements OnInit {
  @ViewChild('masonryFeed') masonryFeed!: NgxMasonryComponent;
  @Input() postsFeedSimilar: SocialTag[] = [];

  masonryOptions = {
    itemSelector: '.masonry-item',
    columnWidth: '.grid-sizer',
    percentPosition: true,
    horizontalOrder: true,
    imagesLoaded: true
  };

  ngOnInit(): void {
    setTimeout(() => this.masonryFeed.layout(), 100);
  }
  onVideoLoaded() {
    this.masonryFeed?.layout();
  }
}

