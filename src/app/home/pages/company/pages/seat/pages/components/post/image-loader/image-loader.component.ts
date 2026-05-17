import { CommonModule }                                      from '@angular/common';
import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { IonicModule }                                       from '@ionic/angular';
import { SessionService }                                    from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-image-loader',
  templateUrl: './image-loader.component.html',
  styleUrls: ['./image-loader.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ImageLoaderComponent implements OnDestroy {
  @Input() src!: string | null;
  @Input() alt: string = '';
  @Input() width: string = '100%';
  @Input() height: string = 'auto';
  @Input() rounded: string = '0.938rem';
  @Input() aspectRatio: string | null = null;
  @Input() fallback: string = 'https://placehold.co/100x100?text=Image';
  @Input() isAvatar: boolean = false;
  @Input() viewPostAction: boolean = false;
  @Output() viewPost: EventEmitter<any> = new EventEmitter<any>();

  isLoaded = false;
  private viewTimer: any;
  private hasViewBeenCounted = false;

  constructor(
    public sessionService: SessionService
  ) {}

  ngOnDestroy() {
    if (this.viewTimer) {
      clearTimeout(this.viewTimer);
    }
  }

  onImageLoad() {
    this.isLoaded = true;
    if (this.viewPostAction && !this.hasViewBeenCounted) {
      this.initLogicViewPost();
    }
  }

  initLogicViewPost() {
    this.viewTimer = setTimeout(() => {
      if (!this.hasViewBeenCounted) {
        this.hasViewBeenCounted = true;
        this.viewPost.emit();
      }
    }, 0);
  }
}
