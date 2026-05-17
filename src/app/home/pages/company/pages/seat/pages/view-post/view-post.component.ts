// view-post.component.ts
import { Component, OnDestroy, OnInit, ViewChild, ElementRef }                                from '@angular/core';
import { SocialPostByUser, SocialTag }                                                        from 'src/app/shared/interfaces/social/social-post';
import { SocialService }                                                                      from 'src/app/shared/services/social.service';
import { SessionService }                                                                     from 'src/app/shared/services/session.service';
import { UserService }                                                                        from 'src/app/shared/services';
import { ActivatedRoute }                                                                     from '@angular/router';
import { ModalController, NavController }                                                     from '@ionic/angular';
import { ComponentModule }                                                                    from 'src/app/components/component.module';
import { VideoPlayerComponent }                                                               from '../components/post/video-player/video-player.component';
import { ImageLoaderComponent }                                                               from '../components/post/image-loader/image-loader.component';
import { CommonModule }                                                                       from '@angular/common';
import { IonChip, IonContent, IonIcon, IonText, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { FeedSimilarPostComponent }                                                           from "../components/feed/feed-similar-post/feed-similar-post.component";
import { ViewPostTagsComponent }                                                              from '../components/post/view-post-tags/view-post-tags.component';
import { DeletePostModalComponent }                                                           from '../components/modals/delete-post-modal/delete-post-modal.component';
import { NumberFormatPipe }                                                                   from 'src/app/shared/pipes/number-format.pipe';
import { catchError, Observable, tap, throwError }                                            from 'rxjs';


interface FeedData {
  posts: SocialTag[];
  pagination: PaginationState;
}
interface PaginationState {
  offset: number;
  isLoading: boolean;
  hasMore: boolean;
}
enum FeedTab {
  SIMILAR = 'similar'
}
const PAGINATION_CONFIG = {
  LIMIT: 10,
  INITIAL_OFFSET: 1
};

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.scss'],
  standalone: true,
  imports: [
    IonText,
    IonContent,
    IonIcon,
    IonChip,
    CommonModule,
    ComponentModule,
    VideoPlayerComponent,
    ImageLoaderComponent,
    FeedSimilarPostComponent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    NumberFormatPipe
  ]
})
export class ViewPostComponent implements OnInit, OnDestroy {
  @ViewChild('likeButton', { read: ElementRef }) likeButton!: ElementRef;
  @ViewChild('mediaContainer', { read: ElementRef }) mediaContainer!: ElementRef;
  @ViewChild(VideoPlayerComponent) videoPlayer?: VideoPlayerComponent;

  id: string = '';
  width: number = 0;
  height: number = 0;
  post: SocialTag = {} as SocialTag;

  expanded = false;

  statusFollow: boolean = false;
  statusLike: boolean = false;
  statusSave: boolean = false;

  // Like animation
  showLikeOverlay: boolean = false;
  showLikeAnimation: boolean = false;
  likeDisponible: boolean = false;
  isAnimating: boolean = false;
  isDisappearing: boolean = false;
  isAppearingOutline: boolean = false;

  // Posición dinámica del botón
  likeButtonPosition: { top: number; left: number } = { top: 0, left: 0 };
  mediaCenter: { top: number; left: number } = { top: 0, left: 0 };

  constructor(
    private sessionService: SessionService,
    private socialService: SocialService,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ){}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id')!;
    });
    this.route.queryParams.subscribe((params: any) => {
      this.width = params.width;
      this.height = params.height;
      this.getPost();
    });
  }

  ionViewWillLeave() {
    this.videoPlayer?.stop();
  }

  // Getter: usuario restringido — no puede dar like, guardar, compartir ni contar view
  get isRestrictedUser(): boolean {
    return this.sessionService.isCompanyLegal || this.sessionService.isProfessionalAdministrative;
  }

  get postsFeedSimilar(): SocialTag[] { return this.feedData[FeedTab.SIMILAR].posts; }
  get hasMore(): boolean { return this.feedData[FeedTab.SIMILAR].pagination.hasMore; }
  loadMore(event: any): void {
    this.loadFeedData(FeedTab.SIMILAR, false, event).subscribe();
  }

  feedData: Record<string, FeedData> = {
    [FeedTab.SIMILAR]: {
      posts: [],
      pagination: this.createInitialPaginationState()
    }
  };

  private createInitialPaginationState(): PaginationState {
    return {
      offset: PAGINATION_CONFIG.INITIAL_OFFSET,
      isLoading: false,
      hasMore: true
    };
  }

  get viewButtonFollow(): boolean {
    return !this.statusFollow
      && !this.sessionService.isCompanyLegal
      && !this.sessionService.isProfessionalAdministrative
      && (this.idPost != this.idUser);
  }

  get idPost(): string {
    return this.post?.seat ? this.post?.seat?.id! : this.post?.user?.id!;
  }

  get idUser(): string {
    return JSON.parse(localStorage.getItem('appPassaparola_user')!).id;
  }

  get isMyPost(): boolean {
    return this.idPost === this.idUser;
  }

  get amountLikes(): number {
    return this.post?.likes?.filter(like => like.status).length || 0;
  }

  get amountViews(): number {
    return this.post?.views?.filter(view => view.status).length || 0;
  }

  get amountSaves(): number {
    return this.post?.saves?.filter(save => save.status).length || 0;
  }

  get amountShares(): number {
    return this.post?.shares?.filter(share => share.status).length || 0;
  }

  // Double Click Handler — bloqueado para usuarios restringidos
  handleDoubleClick() {
    if (this.isRestrictedUser) return;

    this.calculateLikeButtonPosition();

    if (!this.statusLike) {
      this.statusLike = true;
      this.triggerLikeOverlay();
      this.like();
    } else {
      this.statusLike = false;
      this.triggerDislikeAnimation();
      this.like();
    }
  }

  calculateLikeButtonPosition() {
    if (this.likeButton && this.mediaContainer) {
      const buttonRect = this.likeButton.nativeElement.getBoundingClientRect();
      const containerRect = this.mediaContainer.nativeElement.getBoundingClientRect();

      this.likeButtonPosition = {
        top: buttonRect.top + buttonRect.height / 2,
        left: buttonRect.left + buttonRect.width / 2
      };

      this.mediaCenter = {
        top: containerRect.top + containerRect.height / 2,
        left: containerRect.left + containerRect.width / 2
      };
    }
  }

  triggerLikeOverlay() {
    if (this.likeDisponible) return;

    this.showLikeOverlay = true;
    this.showLikeAnimation = true;

    setTimeout(() => {
      this.showLikeOverlay = false;
      this.showLikeAnimation = false;
    }, 900);
  }

  triggerDislikeAnimation() {
    if (this.likeDisponible) return;

    this.isDisappearing = true;
    this.isAppearingOutline = true;

    setTimeout(() => {
      this.isDisappearing = false;
    }, 400);

    setTimeout(() => {
      this.isAppearingOutline = false;
    }, 750);
  }

  triggerLikeAnimation() {
    if (this.likeDisponible) return;

    this.showLikeAnimation = true;
    this.likeDisponible = true;

    setTimeout(() => {
      this.showLikeAnimation = false;
    }, 900);

    setTimeout(() => {
      this.likeDisponible = false;
    }, 1100);
  }

  // GET POST
  getPost() {
    this.socialService.getPost(this.id).subscribe({
      next: (post) => {
        this.post = post;
        this.followStatus();
        this.loadFeedData(FeedTab.SIMILAR, true).subscribe();
      }
    });
  }

  private loadFeedData(feedType: string, reset: boolean = false, event?: any): Observable<any> {
    const feedData = this.feedData[feedType];

    if (feedData.pagination.isLoading || (!feedData.pagination.hasMore && !reset)) {
      event?.target.complete?.();
      return new Observable(observer => observer.complete());
    }

    if (reset) {
      feedData.pagination = this.createInitialPaginationState();
      feedData.posts = [];
    }

    feedData.pagination.isLoading = true;

    const serviceMethod = this.getServiceMethod(feedType);
    const params = {
      offset: feedData.pagination.offset,
      limit: PAGINATION_CONFIG.LIMIT
    };

    return serviceMethod(
      params,
      this.post.company ? this.post.company?.id! : this.post.user?.id!,
      this.id
    ).pipe(
      tap((response: SocialPostByUser) => {
        const newData = response.data || [];
        feedData.posts = [...feedData.posts, ...newData];

        if (newData.length < PAGINATION_CONFIG.LIMIT) {
          feedData.pagination.hasMore = false;
        } else {
          feedData.pagination.offset++;
        }

        feedData.pagination.isLoading = false;
        event?.target.complete?.();
      }),
      catchError(() => {
        feedData.pagination.isLoading = false;
        event?.target.complete?.();
        return throwError('Error loading feed data');
      })
    );
  }

  private getServiceMethod(feedType: string): (params: any, userId: string, socialId: string) => Observable<SocialPostByUser> {
    switch (feedType) {
      case FeedTab.SIMILAR:
        return this.socialService.similarPost.bind(this.socialService);
      default:
        throw new Error(`Unknown feed type: ${feedType}`);
    }
  }

  // Modal para view post tags — disponible para todos
  async openViewPostTags() {
    const modal = await this.modalCtrl.create({
      component: ViewPostTagsComponent,
      componentProps: {
        post: this.post
      },
      cssClass: ['radius-modals', 'modal-60vh'],
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });
    modal.present();
  }

  // LIKE — bloqueado para usuarios restringidos
  like() {
    if (this.isRestrictedUser) return;
    if (this.likeDisponible) return;

    this.isAnimating = true;
    this.likeDisponible = true;

    setTimeout(() => {
      this.isAnimating = false;
    }, 400);

    this.socialService.like(this.post.id!).subscribe({
      next: (like) => {
        this.socialService.likeUpdatedSource.next({ idPost: this.post.id, like });
        this.likeStatusService();
        const index = this.post.likes!.findIndex(l => l.id === like.id);
        if (index !== -1) {
          this.post.likes![index] = like;
        } else {
          this.post.likes!.push(like);
        }
        this.likeDisponible = false;
      },
      error: () => {
        this.statusLike = !this.statusLike;
        this.showLikeAnimation = false;
        this.showLikeOverlay = false;
        this.likeDisponible = false;
        this.isAnimating = false;
        this.isDisappearing = false;
      }
    });
  }

  // SAVE — bloqueado para usuarios restringidos
  save() {
    if (this.isRestrictedUser) return;

    this.socialService.save(this.post.id!).subscribe({
      next: (save) => {
        this.saveStatusService();
        const index = this.post.saves!.findIndex(l => l.id === save.id);
        if (index !== -1) {
          this.post.saves![index] = save;
        } else {
          this.post.saves!.push(save);
        }
      }
    });
  }

  // SHARE — bloqueado para usuarios restringidos
  share() {
    if (this.isRestrictedUser) return;

    this.socialService.share(this.post.id!).subscribe({
      next: (shares) => {
        const index = this.post.shares!.findIndex(s => s.id === shares.id);
        if (index !== -1) {
          this.post.shares![index] = shares;
        } else {
          this.post.shares!.push(shares);
        }
      }
    });
  }

  // VIEW POST — bloqueado para usuarios restringidos
  viewPost() {
    if (this.isRestrictedUser) return;

    this.socialService.viewPost(this.post.id!).subscribe({
      next: (response) => this.findOneStatus()
    });
  }

  // FOLLOW
  followUser() {
    this.socialService.follow(this.post?.user?.id!).subscribe({
      next: (response) => {
        this.findOneStatus();
        this.followStatus();
      }
    });
  }

  followBusiness() {
    this.socialService.follow(this.post?.seat?.id!).subscribe({
      next: (response) => {
        this.findOneStatus();
        this.followStatus();
      }
    });
  }

  findOneStatus() {
    if (this.post.seat) {
      this.findOne(this.post.seat.id!);
    }
    if (this.post.user) {
      this.findOne(this.post!.user!.id!);
    }
  }

  private findOne(id: string) {
    this.socialService.socialSummary(id, false).subscribe({
      next: (data) => {
        this.socialService.seatNext = data;
      },
    });
  }

  followStatus() {
    if (this.post.seat) {
      this.followStatusService(this.post.seat.id!);
    }
    if (this.post.user) {
      this.followStatusService(this.post!.user!.id!);
    }
    // likeStatus y saveStatus no se cargan para usuarios restringidos
    if (!this.isRestrictedUser) {
      this.likeStatusService();
      this.saveStatusService();
    }
  }

  private followStatusService(id: string) {
    this.socialService.followStatus(id).subscribe({
      next: (data: any) => {
        this.statusFollow = data.isFollowing;
      },
    });
  }

  private likeStatusService() {
    this.socialService.likeStatus(this.post.id!).subscribe({
      next: (data: any) => {
        this.statusLike = data.isLiked;
      },
    });
  }

  private saveStatusService() {
    this.socialService.saveStatus(this.post.id!).subscribe({
      next: (data: any) => {
        this.statusSave = data.isSaved;
      },
    });
  }

  // VIEW PROFILE
  onProfileUser(id: string) {
    this.modalCtrl.dismiss();
    this.navCtrl.navigateForward(['/pages/company/seat/modify-simple', id],
      (this.idPost != this.idUser) ? { queryParams: { detail: true } } : {}
    );
  }

  onProfileBusiness(id: string) {
    this.modalCtrl.dismiss();
    this.navCtrl.navigateForward(['/pages/company/seat/modify', id],
      (this.idPost != this.idUser) ? { queryParams: { detail: true } } : {}
    );
  }

  // DELETE POST
  async deletePost() {
    const modal = await this.modalCtrl.create({
      component: DeletePostModalComponent,
      componentProps: {
        post: this.post
      },
      cssClass: ['radius-modals', 'modal-60vh'],
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
  }
}
