// post-feed.component.ts
import { CommonModule }                                                                            from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { SocialTag }                                                                               from 'src/app/shared/interfaces/social/social-post';
import { IonIcon, IonSkeletonText }                                                                from '@ionic/angular/standalone';
import { SocialService }                                                                           from 'src/app/shared/services/social.service';
import { ModalActionNotValidComponent }                                                            from 'src/app/components/modal-action-not-valid/modal-action-not-valid.component';
import { ModalController, NavController }                                                          from '@ionic/angular';
import { SessionService }                                                                          from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    IonSkeletonText
  ]
})
export class PostFeedComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoEl') videoEl?: ElementRef<HTMLVideoElement>;
  @Output() onVideoLoaded: EventEmitter<any> = new EventEmitter<any>();
  @Input() post: SocialTag = {} as SocialTag;
  @Input() slide: boolean = false;
  @Input() feed: boolean = false;
  @Input() isPublic: boolean = false;

  likeDisponible: boolean = false;
  isAnimating: boolean = false;
  showLikeOverlay: boolean = false;
  isDisappearing: boolean = false;
  videoReady: boolean = false;
  private clickTimeout: any;
  private clickCount: number = 0;
  private observer?: IntersectionObserver;

  constructor(
    private navCtrl: NavController,
    private socialService: SocialService,
    private modalCtrl: ModalController,
    private sessionService: SessionService
  ) {}

  // Getter: usuario restringido — no puede dar like
  get isRestrictedUser(): boolean {
    return this.sessionService.isCompanyLegal || this.sessionService.isProfessionalAdministrative;
  }

  ngAfterViewInit(): void {
    if (this.post.typeFile === 'video' && this.videoEl?.nativeElement) {
      const video = this.videoEl.nativeElement;

      video.muted = true;
      video.volume = 0;

      video.addEventListener('loadedmetadata', () => {
        video.currentTime = 0.1;
        video.muted = true;
        video.volume = 0;
      }, { once: true });

      video.addEventListener('pause', () => {
        if (video.currentTime === 0) {
          video.currentTime = 0.1;
        }
        video.muted = true;
        video.volume = 0;
      });

      video.addEventListener('ended', () => {
        video.currentTime = 0.1;
        video.muted = true;
        video.volume = 0;
      });

      video.addEventListener('volumechange', () => {
        video.muted = true;
        video.volume = 0;
      });

      video.addEventListener('play', () => {
        video.muted = true;
        video.volume = 0;
      });

      if (this.feed) {
        this.setupVideoObserver();
      }
    }
  }

  onVideoReady(): void {
    this.videoReady = true;
    this.onVideoLoaded.emit();

    if (this.videoEl?.nativeElement) {
      const video = this.videoEl.nativeElement;
      video.muted = true;
      video.volume = 0;
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
    }
  }

  private setupVideoObserver(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = this.videoEl?.nativeElement;
        if (!video) return;

        video.muted = true;
        video.volume = 0;

        if (entry.isIntersecting) {
          if (video.currentTime < 0.1) {
            video.currentTime = 0.1;
          }
          video.muted = true;
          video.volume = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
          if (video.currentTime === 0) {
            video.currentTime = 0.1;
          }
        }
      });
    }, options);

    if (this.videoEl?.nativeElement) {
      this.observer.observe(this.videoEl.nativeElement);
    }
  }

  async viewVideo(video: HTMLVideoElement | null) {
    if (this.isPublic) {
      await this.actionNotValid();
      return;
    }

    if (!video || !this.post?.id) return;

    const width = video.videoWidth || video.clientWidth || 0;
    const height = video.videoHeight || video.clientHeight || 0;

    this.navCtrl.navigateForward(['/pages/company/seat/view-post', this.post.id], {
      queryParams: { width, height }
    });
  }

  async viewImage(event: Event) {
    if (this.isPublic) {
      await this.actionNotValid();
      return;
    }

    if (!this.post?.id) return;

    const target = event.target as HTMLImageElement;
    if (!target) return;

    const width = target.naturalWidth || 0;
    const height = target.naturalHeight || 0;

    this.navCtrl.navigateForward(['/pages/company/seat/view-post', this.post.id], {
      queryParams: { width, height }
    });
  }

  async handleClick() {
    if (this.isPublic) {
      await this.actionNotValid();
      return;
    }

    this.clickCount++;

    if (this.clickCount === 1) {
      this.clickTimeout = setTimeout(() => {
        if (this.post.typeFile === 'image') {
          const imgElement = document.querySelector('.post-media__image') as HTMLImageElement;
          if (imgElement) {
            const width = imgElement.naturalWidth || 0;
            const height = imgElement.naturalHeight || 0;
            this.navCtrl.navigateForward(['/pages/company/seat/view-post', this.post.id], {
              queryParams: { width, height }
            });
          }
        } else {
          const video = this.videoEl?.nativeElement;
          if (video) {
            this.viewVideo(video);
          }
        }
        this.clickCount = 0;
      }, 300);
    }
  }

  async handleDoubleClick() {
    if (this.isPublic) {
      clearTimeout(this.clickTimeout);
      this.clickCount = 0;
      await this.actionNotValid();
      return;
    }

    // Bloqueado para usuarios restringidos — no se da like con doble click
    if (this.isRestrictedUser) {
      clearTimeout(this.clickTimeout);
      this.clickCount = 0;
      return;
    }

    clearTimeout(this.clickTimeout);
    this.clickCount = 0;

    if (!this.statusLike) {
      this.triggerLikeOverlay();
      this.like();
    } else {
      this.triggerDislikeAnimation();
      this.like();
    }
  }

  triggerLikeOverlay() {
    if (this.likeDisponible) return;
    this.showLikeOverlay = true;
    setTimeout(() => {
      this.showLikeOverlay = false;
    }, 1000);
  }

  triggerDislikeAnimation() {
    if (this.likeDisponible) return;
    this.isDisappearing = true;
    setTimeout(() => {
      this.isDisappearing = false;
    }, 600);
  }

  get amountTags(): number {
    let count = 0;
    if (this.post.products && Array.isArray(this.post.products)) {
      count += this.post.products.length;
    }
    return count;
  }

  // LIKE — bloqueado para usuarios restringidos
  async like() {
    if (this.isPublic) {
      await this.actionNotValid();
      return;
    }

    if (this.isRestrictedUser) return;

    if (this.likeDisponible) return;

    this.isAnimating = true;
    this.likeDisponible = true;

    setTimeout(() => {
      this.isAnimating = false;
    }, 600);

    this.socialService.like(this.post.id!, false).subscribe({
      next: (like) => {
        this.socialService.likeUpdatedSource.next({idPost: this.post.id, like});
        this.likeDisponible = false;
      },
      error: () => {
        this.isAnimating = false;
        this.likeDisponible = false;
        this.showLikeOverlay = false;
        this.isDisappearing = false;
      }
    });
  }

  get statusLike(): boolean {
    const currentUserId = this.idUserOrCompany;
    if (!currentUserId) {
      return false;
    }
    return this.post.likes!.some(like =>
      (like.user?.id === currentUserId || like.seat?.id === currentUserId) &&
      like.status === true
    );
  }

  private get idUserOrCompany() {
    const user = this.getLocalStorageItem('appPassaparola_user');
    const seat = user?.rol === 'company'
      ? this.getLocalStorageItem('appPassaparola_loginSeat')
      : user;
    return seat?.id;
  }

  private getLocalStorageItem(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  async actionNotValid(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModalActionNotValidComponent,
      cssClass: 'bg-transp'
    });
    await modal.present();
  }
}
