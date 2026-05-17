import { CommonModule }      from '@angular/common';
import { Component, Input }  from '@angular/core';
import { IonIcon }           from "@ionic/angular/standalone";
import { SocialTag }         from 'src/app/shared/interfaces/social/social-post';
import { PostFeedComponent } from '../post-feed/post-feed.component';
// import { FormattNumberPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'app-post-feed-slide',
  templateUrl: './post-feed-slide.component.html',
  styleUrls: ['./post-feed-slide.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    PostFeedComponent,
    // FormattNumberPipe
  ]
})
export class PostFeedSlideComponent {
  @Input() post: SocialTag = {} as SocialTag;
}
