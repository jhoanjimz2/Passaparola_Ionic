import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy, ChangeDetectorRef }             from '@angular/core';
import { ModalController, NavController }                                                                                            from '@ionic/angular';
import { CreateSocialTagComponent }                                                                                                  from '../pages/company/pages/seat/pages/components/create-post/create-social-tag/create-social-tag.component';
import { SocialService }                                                                                                             from 'src/app/shared/services/social.service';
import { SocialPostByUser, SocialTag }                                                                                               from 'src/app/shared/interfaces/social/social-post';
import { NgxMasonryComponent, NgxMasonryModule }                                                                                     from 'ngx-masonry';
import { CommonModule }                                                                                                              from '@angular/common';
import { IonContent, IonFab, IonFabButton, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { TranslateModule }                                                                                                           from '@ngx-translate/core';
import { PostFeedComponent }                                                                                                         from '../pages/company/pages/seat/pages/components/post/post-feed/post-feed.component';
import { Subject }                                                                                                                   from 'rxjs';
import { LikeButtonService }                                                                                                         from 'src/app/shared/services/like-button.service';
import { SearchBarSocialComponent }                                                                                                  from '../pages/company/pages/seat/pages/components/shared/search-bar-social/search-bar-social.component';
import { takeUntil }                                                                                                                 from 'rxjs/operators';
import { PostFeedSlideComponent }                                                                                                    from '../pages/company/pages/seat/pages/components/post/post-feed-slide/post-feed-slide.component';

type FeedType = 'all' | 'friends';

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss'],
  standalone: true,
  imports: [
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRefresher,
    IonRefresherContent,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    NgxMasonryModule,
    CommonModule,
    TranslateModule,
    PostFeedComponent,
    PostFeedSlideComponent,
    SearchBarSocialComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SocialComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;
  @ViewChild('masonryAll', { static: false }) masonryAll!: NgxMasonryComponent;
  @ViewChild('masonryFriends', { static: false }) masonryFriends!: NgxMasonryComponent;
  @ViewChild('feedSwitcher', { read: ElementRef }) feedSwitcher!: ElementRef;
  @ViewChild(IonContent, { static: false }) ionContent!: IonContent;

  private destroy$ = new Subject<void>();
  private layoutQueue: any[] = [];
  private isProcessingLayout = false;

  showStickyHeader = false;

  // Community posts
  myCommunityPost: SocialTag[] = [];
  private readonly LIMIT_COMMUNITY = 10;
  private pageCommunity = 1;
  private lastPageCommunity = 1;
  isLoadingCommunity = false;
  hasMoreCommunity = true;
  private currentSlide = 0;
  private readonly LOAD_THRESHOLD = 2;

  // Current feed
  activeFeedType: FeedType = 'all';

  // All posts
  allPost: SocialTag[] = [];
  private readonly LIMIT_ALL = 10;
  private pageAll = 1;
  private lastPageAll = 1;
  isLoadingAll = false;
  hasMoreAll = true;

  // Friends posts
  friendsPost: SocialTag[] = [];
  private readonly LIMIT_FRIENDS = 10;
  private pageFriends = 1;
  private lastPageFriends = 1;
  isLoadingFriends = false;
  hasMoreFriends = true;

  readonly masonryOptions = {
    itemSelector: '.masonry-item',
    columnWidth: '.grid-sizer',
    percentPosition: true,
    horizontalOrder: true,
    transitionDuration: '0s',
    initLayout: true,
    resize: true,
    fitWidth: false
  };

  constructor(
    private modalController: ModalController,
    private socialService: SocialService,
    private likeButtonService: LikeButtonService,
    private cdr: ChangeDetectorRef,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.loadAllPost(true);
    this.loadPostCommunity(true);
    this.subscribeToLikeChanges();
  }

  ngAfterViewInit() {
    this.setupSwiperEvents();
    this.setupScrollListener();
  }

  ionViewWillEnter() {
    // Solo hacer layout suave cuando vuelve a la vista
    this.queueLayout(150);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearLayoutQueue();
  }

  private clearLayoutQueue() {
    this.layoutQueue.forEach(timer => clearTimeout(timer));
    this.layoutQueue = [];
    this.isProcessingLayout = false;
  }

  private queueLayout(delay: number = 50) {
    if (this.isProcessingLayout) return;

    const timer = setTimeout(() => {
      this.performSmoothLayout();
    }, delay);

    this.layoutQueue.push(timer);
  }

  private performSmoothLayout() {
    this.isProcessingLayout = true;

    try {
      requestAnimationFrame(() => {
        if (this.activeFeedType === 'all' && this.masonryAll) {
          this.masonryAll.layout();
        } else if (this.activeFeedType === 'friends' && this.masonryFriends) {
          this.masonryFriends.layout();
        }

        this.isProcessingLayout = false;
      });
    } catch (e) {
      this.isProcessingLayout = false;
    }
  }

  private setupScrollListener() {
    this.ionContent.ionScroll.pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
      this.handleScroll(event);
    });
  }

  private handleScroll(event: any) {
    if (this.feedSwitcher?.nativeElement) {
      const switcherRect = this.feedSwitcher.nativeElement.getBoundingClientRect();
      const shouldShowSticky = switcherRect.top < 60;

      if (this.showStickyHeader !== shouldShowSticky) {
        this.showStickyHeader = shouldShowSticky;
        this.cdr.detectChanges();
      }
    }
  }

  onSearchChange(searchText: string) {}

  onSearchSubmit(searchText: string) {
    this.navCtrl.navigateForward(['/pages/company/seat/search-post/', searchText]);
  }

  private subscribeToLikeChanges() {
    this.socialService.likeUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ idPost, like }) => {
          const postArrays = [this.allPost, this.friendsPost, this.myCommunityPost];
          this.likeButtonService.updateLikeInMultipleArrays(postArrays, idPost, like);
          this.cdr.detectChanges();
        }
      });
  }

  async handleRefresh(event: any) {
    try {
      await this.resetAndLoadAllFeeds();
    } finally {
      event.target.complete();
      this.queueLayout(200);
    }
  }

  private async resetAndLoadAllFeeds(): Promise<void> {
    this.resetCommunityState();

    if (this.activeFeedType === 'all') {
      this.resetAllPostsState();
    } else {
      this.resetFriendsPostsState();
    }

    return new Promise((resolve) => {
      let completed = 0;
      const checkComplete = () => {
        completed++;
        if (completed === 2) resolve();
      };

      this.loadPostCommunity(true, checkComplete);

      if (this.activeFeedType === 'all') {
        this.loadAllPost(true, undefined, checkComplete);
      } else {
        this.loadFriendsPost(true, undefined, checkComplete);
      }
    });
  }

  switchToAllFeed() {
    if (this.activeFeedType === 'all') return;
    this.activeFeedType = 'all';
    this.cdr.detectChanges();

    if (this.allPost.length === 0) {
      this.loadAllPost(true);
    } else {
      this.queueLayout(100);
    }
  }

  switchToFriendsFeed() {
    if (this.activeFeedType === 'friends') return;
    this.activeFeedType = 'friends';
    this.cdr.detectChanges();

    if (this.friendsPost.length === 0) {
      this.loadFriendsPost(true);
    } else {
      this.queueLayout(100);
    }
  }

  get hasMoreCurrentFeed(): boolean {
    return this.activeFeedType === 'all' ? this.hasMoreAll : this.hasMoreFriends;
  }

  // COMMUNITY POSTS
  private setupSwiperEvents() {
    const swiper = this.swiperContainer?.nativeElement?.swiper;
    if (!swiper) return;

    swiper.on('slideChange', () => {
      this.currentSlide = swiper.activeIndex;
      this.checkAndLoadMoreCommunity();
    });

    swiper.on('progress', (progress: number) => {
      if (progress > 0.8) this.checkAndLoadMoreCommunity();
    });
  }

  private checkAndLoadMoreCommunity() {
    const remaining = this.myCommunityPost.length - this.currentSlide;
    if (remaining <= this.LOAD_THRESHOLD && this.hasMoreCommunity && !this.isLoadingCommunity) {
      this.loadPostCommunity(false);
    }
  }

  private resetCommunityState() {
    this.pageCommunity = 1;
    this.lastPageCommunity = 1;
    this.hasMoreCommunity = true;
    this.myCommunityPost = [];
    this.currentSlide = 0;
  }

  private loadPostCommunity(reset: boolean = false, callback?: () => void) {
    if (this.isLoadingCommunity && !reset) {
      callback?.();
      return;
    }

    if (reset) this.resetCommunityState();
    this.isLoadingCommunity = true;

    this.socialService.findAllByCommunity({
      offset: this.pageCommunity,
      limit: this.LIMIT_COMMUNITY
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: SocialPostByUser) => {
          this.handleCommunityResponse(response, reset);
          this.updateSwiperAndLayout();
          callback?.();
        },
        error: () => {
          this.isLoadingCommunity = false;
          this.hasMoreCommunity = false;
          this.cdr.detectChanges();
          callback?.();
        }
      });
  }

  private handleCommunityResponse(response: SocialPostByUser, reset: boolean) {
    const newData = response.data || [];
    this.myCommunityPost = reset ? newData : [...this.myCommunityPost, ...newData];
    this.lastPageCommunity = response.metadata?.lastPage || 1;

    if (this.pageCommunity >= this.lastPageCommunity || newData.length < this.LIMIT_COMMUNITY) {
      this.hasMoreCommunity = false;
    } else {
      this.pageCommunity++;
    }

    this.isLoadingCommunity = false;
    this.cdr.detectChanges();
  }

  private updateSwiperAndLayout() {
    setTimeout(() => {
      this.swiperContainer?.nativeElement?.swiper?.update();
    }, 100);
  }

  onSlideChange(event: any) {
    if (event?.detail?.[0]?.activeIndex !== undefined) {
      this.currentSlide = event.detail[0].activeIndex;
      this.checkAndLoadMoreCommunity();
    }
  }

  onReachEnd() {
    if (this.hasMoreCommunity && !this.isLoadingCommunity) {
      this.loadPostCommunity(false);
    }
  }

  // ALL POSTS
  private resetAllPostsState() {
    this.pageAll = 1;
    this.lastPageAll = 1;
    this.hasMoreAll = true;
    this.allPost = [];
  }

  private loadAllPost(reset: boolean = false, event?: any, callback?: () => void) {
    if (this.isLoadingAll && !reset) {
      event?.target.complete();
      callback?.();
      return;
    }

    if (reset) this.resetAllPostsState();
    this.isLoadingAll = true;

    this.socialService.findAll({
      offset: this.pageAll,
      limit: this.LIMIT_ALL
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: SocialPostByUser) => {
          this.handleAllPostsResponse(response, reset);
          event?.target.complete();
          if (reset) {
            this.queueLayout(200);
          } else {
            this.queueLayout(50);
          }
          callback?.();
        },
        error: () => {
          this.isLoadingAll = false;
          this.hasMoreAll = false;
          event?.target.complete();
          this.cdr.detectChanges();
          callback?.();
        }
      });
  }

  private handleAllPostsResponse(response: SocialPostByUser, reset: boolean) {
    const newData = response.data || [];
    this.allPost = reset ? newData : [...this.allPost, ...newData];
    this.lastPageAll = response.metadata?.lastPage || 1;

    if (this.pageAll >= this.lastPageAll || newData.length < this.LIMIT_ALL) {
      this.hasMoreAll = false;
    } else {
      this.pageAll++;
    }

    this.isLoadingAll = false;
    this.cdr.detectChanges();
  }

  onAllVideoLoaded() {
    this.queueLayout(100);
  }

  // FRIENDS POSTS
  private resetFriendsPostsState() {
    this.pageFriends = 1;
    this.lastPageFriends = 1;
    this.hasMoreFriends = true;
    this.friendsPost = [];
  }

  private loadFriendsPost(reset: boolean = false, event?: any, callback?: () => void) {
    if (this.isLoadingFriends && !reset) {
      event?.target.complete();
      callback?.();
      return;
    }

    if (reset) this.resetFriendsPostsState();
    this.isLoadingFriends = true;

    this.socialService.findAll({
      offset: this.pageFriends,
      limit: this.LIMIT_FRIENDS
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: SocialPostByUser) => {
          this.handleFriendsPostsResponse(response, reset);
          event?.target.complete();
          if (reset) {
            this.queueLayout(200);
          } else {
            this.queueLayout(50);
          }
          callback?.();
        },
        error: () => {
          this.isLoadingFriends = false;
          this.hasMoreFriends = false;
          event?.target.complete();
          this.cdr.detectChanges();
          callback?.();
        }
      });
  }

  private handleFriendsPostsResponse(response: SocialPostByUser, reset: boolean) {
    const newData = response.data || [];
    this.friendsPost = reset ? newData : [...this.friendsPost, ...newData];
    this.lastPageFriends = response.metadata?.lastPage || 1;

    if (this.pageFriends >= this.lastPageFriends || newData.length < this.LIMIT_FRIENDS) {
      this.hasMoreFriends = false;
    } else {
      this.pageFriends++;
    }

    this.isLoadingFriends = false;
    this.cdr.detectChanges();
  }

  onFriendsVideoLoaded() {
    this.queueLayout(100);
  }

  loadMore(event: any) {
    if (this.activeFeedType === 'all') {
      this.loadAllPost(false, event);
    } else {
      this.loadFriendsPost(false, event);
    }
  }

  async createSocialTag() {
    const modal = await this.modalController.create({
      component: CreateSocialTagComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: false,
    });
    await modal.present();
  }

  trackByPost(index: number, post: SocialTag): string | number {
    return post.id ?? index;
  }
}
