import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy }                                      from '@angular/core';
import { ActivatedRoute }                                                                            from '@angular/router';
import { SocialService }                                                                             from 'src/app/shared/services/social.service';
import { CacheService }                                                                              from 'src/app/shared/services/cache.service';
import { CACHE_KEYS }                                                                                from 'src/app/shared/constants/cache-keys';
import { SocialSummary }                                                                             from 'src/app/shared/interfaces/multiple-profile-business/social-summary';
import { Observable, Subscription, catchError, forkJoin, switchMap, tap, throwError }                from 'rxjs';
import { SocialPostByUser, SocialTag }                                                               from 'src/app/shared/interfaces/social/social-post';
import { FollowersService }                                                                          from 'src/app/shared/services/followers.service';
import { Share }                                                                                     from '@capacitor/share';
import { environment }                                                                               from 'src/environments/environment';
import { TranslateService }                                                                          from '@ngx-translate/core';
import { CryptoService, UploadService, UserService }                                                 from 'src/app/shared/services';
import { InternalFollowersTabsComponent }                                                            from '../components/modals/internal-followers-tabs/internal-followers-tabs.component';
import { ExternalFollowersTabsComponent }                                                            from '../components/modals/external-followers-tabs/external-followers-tabs.component';
import { ChatComponent }                                                                             from '../components/modals/chat/chat.component';
import { SeatNameComponent }                                                                         from '../components/edit-profile-simple/seat-name/seat-name.component';
import { SeatUsernameComponent }                                                                     from '../components/edit-profile-simple/seat-username/seat-username.component';
import { ToastrService }                                                                             from 'ngx-toastr';
import { CameraSource }                                                                              from '@capacitor/camera';
import { CameraService }                                                                             from 'src/app/shared/services/camera.service';
import { v4 as uuidv4 }                                                                              from 'uuid';
import { TagRequestsComponent }                                                                      from '../components/request-tags/tag-requests/tag-requests.component';
import { ModalController, NavController }                                                            from '@ionic/angular';
import { CommonModule }                                                                              from '@angular/common';
import { ProfileFeedComponent }                                                                      from '../components/feed/profile-feed/profile-feed.component';
import { ComponentModule }                                                                           from 'src/app/components/component.module';
import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonMenu,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText
} from '@ionic/angular/standalone';
import { HeaderProfileComponent }                                                                    from '../components/shared/header-profile-simple/header-profile.component';
import { CreateSocialTagComponent }                                                                  from 'src/app/home/pages/company/pages/seat/pages/components/create-post/create-social-tag/create-social-tag.component';
import { LikeButtonService }                                                                         from 'src/app/shared/services/like-button.service';
import { ModalActionNotValidComponent }                                                              from 'src/app/components/modal-action-not-valid/modal-action-not-valid.component';
import { ModalShareLinkComponent }                                                                   from 'src/app/components/modal-share-link/modal-share-link.component';

// Enums y constantes
enum FeedTab {
  FEED = 'feed',
  TAGS = 'tags',
  LIKE = 'like',
  SAVED = 'saved',
  SHARED = 'shared'
}

enum ButtonAction {
  CHAT = 'chat',
  FOLLOWING = 'following',
  FOLLOWERS = 'followers',
  FOLLOW = 'follow',
  SHARE = 'share'
}

enum EditAction {
  NAME = 'name',
  USERNAME = 'username',
  IMG_PROFILE = 'img-profile',
  TAG_REQUESTS = 'tag-requests'
}

const PAGINATION_CONFIG = {
  LIMIT: 10,
  INITIAL_OFFSET: 1
};

// Interfaces
interface PaginationState {
  offset: number;
  isLoading: boolean;
  hasMore: boolean;
}

interface FeedData {
  posts: SocialTag[];
  pagination: PaginationState;
}

@Component({
  selector: 'app-profile-social-simple',
  templateUrl: './profile-social-simple.component.html',
  styleUrls: ['./profile-social-simple.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonFab,
    IonMenu,
    IonIcon,
    IonFabButton,
    IonSkeletonText,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRefresher,
    IonRefresherContent,
    HeaderProfileComponent,
    ProfileFeedComponent,
    ComponentModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileSocialSimpleComponent implements OnInit, OnDestroy {
  // Properties
  tabFeed: string = FeedTab.FEED;
  id: string = '';
  seat: SocialSummary = {} as SocialSummary;
  statusFollow: boolean = false;
  showDetail: boolean = false;
  followers: any[] = [];
  mutual: any[] = [];

  isPublic: boolean = false;
  paramsLoaded: boolean = false;
  isLoading: boolean = true;

  // Feed data con estructura optimizada
  feedData: Record<string, FeedData> = {
    [FeedTab.FEED]: {
      posts: [],
      pagination: this.createInitialPaginationState()
    },
    [FeedTab.LIKE]: {
      posts: [],
      pagination: this.createInitialPaginationState()
    },
    [FeedTab.SAVED]: {
      posts: [],
      pagination: this.createInitialPaginationState()
    },
    [FeedTab.SHARED]: {
      posts: [],
      pagination: this.createInitialPaginationState()
    }
  };

  // Subscriptions
  private subscriptions: Subscription[] = [];
  private likeSubscription: Subscription = new Subscription();

  // Getters para compatibilidad con el template existente
  get myPosts(): SocialTag[] { return this.feedData[FeedTab.FEED].posts; }
  get postsFeedLikes(): SocialTag[] { return this.feedData[FeedTab.LIKE].posts; }
  get postsFeedSaveds(): SocialTag[] { return this.feedData[FeedTab.SAVED].posts; }
  get postsFeedShared(): SocialTag[] { return this.feedData[FeedTab.SHARED].posts; }

  get hasMore(): boolean { return this.feedData[FeedTab.FEED].pagination.hasMore; }
  get hasMoreLike(): boolean { return this.feedData[FeedTab.LIKE].pagination.hasMore; }
  get hasMoreSaved(): boolean { return this.feedData[FeedTab.SAVED].pagination.hasMore; }
  get hasMoreShared(): boolean { return this.feedData[FeedTab.SHARED].pagination.hasMore; }

  constructor(
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private socialService: SocialService,
    private cacheService: CacheService,
    private followersService: FollowersService,
    private translate: TranslateService,
    private cryptoService: CryptoService,
    private userService: UserService,
    private toastr: ToastrService,
    private uploadService: UploadService,
    private cameraService: CameraService,
    private likeButtonService: LikeButtonService,
    private navCtrl: NavController
  ) {
    this.initializeObservables();
  }

  ngOnInit(): void {
    this.initializeRouteParams();
    this.subscribeToLikeChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.likeSubscription.unsubscribe();
  }

  // Métodos de inicialización
  private createInitialPaginationState(): PaginationState {
    return {
      offset: PAGINATION_CONFIG.INITIAL_OFFSET,
      isLoading: false,
      hasMore: true
    };
  }

  private initializeObservables(): void {
    this.autoSubscribe(this.socialService.seatObservable, v => this.seat = v);
    this.autoSubscribe(this.socialService.showDetailObservable, v => this.showDetail = v);
    this.autoSubscribe(this.socialService.statusFollowObservable, v => this.statusFollow = v);
  }

  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void): void {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }

  private initializeRouteParams(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id')!;
    });

    this.route.queryParams.subscribe((params: any) => {
      this.isPublic = params['public'] === 'true';
      this.paramsLoaded = true;
      this.socialService.showDetailNext = params.detail === 'true';
      this.initializeData();
    });
  }

  private initializeData(): void {
    // Si hay datos válidos en caché, los restaura instantáneamente sin HTTP
    if (this.restoreFromCache()) return;

    this.isLoading = true;
    this.socialService.clearState();
    this.resetAllFeeds();

    if (this.isPublic) {
      this.loadPublicData();
      return;
    }

    this.findOne().pipe(
      switchMap(() => this.followersToHeader()),
      switchMap(() => {
        if (this.showDetail) this.followStatus();
        return this.loadFeedData(FeedTab.FEED, true);
      })
    ).subscribe({
      next: () => { this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
  }

  /**
   * Restaura perfil + feed desde caché en memoria.
   * El componente se destruye al navegar pero CacheService persiste,
   * por lo que los datos siguen disponibles al volver.
   * @returns true  → caché válida, no hay que ir al servidor
   *          false → sin caché, ejecutar carga normal
   */
  private restoreFromCache(): boolean {
    const profileKey = this.isPublic
      ? `${CACHE_KEYS.profile(this.id)}:public`
      : CACHE_KEYS.profile(this.id);

    const feedKey = this.isPublic
      ? `${CACHE_KEYS.feed(this.id)}:public:p${PAGINATION_CONFIG.INITIAL_OFFSET}`
      : `${CACHE_KEYS.feed(this.id)}:p${PAGINATION_CONFIG.INITIAL_OFFSET}`;

    const cachedProfile = this.cacheService.get<SocialSummary>(profileKey);
    const cachedFeed    = this.cacheService.get<SocialPostByUser>(feedKey);

    if (!cachedProfile || !cachedFeed) return false;

    // Restaurar perfil al BehaviorSubject → template lo recibe via seatObservable
    this.socialService.seatNext = cachedProfile;

    // Restaurar feed directamente en el componente
    const posts = cachedFeed.data || [];
    this.feedData[FeedTab.FEED].posts      = posts;
    this.feedData[FeedTab.FEED].pagination = {
      offset:    PAGINATION_CONFIG.INITIAL_OFFSET + 1,
      isLoading: false,
      hasMore:   posts.length >= PAGINATION_CONFIG.LIMIT
    };

    this.isLoading = false;

    // followStatus en background si aplica (no bloquea la UI)
    if (this.showDetail) this.followStatus();

    return true;
  }

  private loadPublicData(): void {
    forkJoin([
      this.socialService.socialSummaryPublic(this.id),
      this.loadPublicFeedData()
    ]).subscribe({
      next: ([socialData, _]) => {
        if (socialData) this.socialService.seatNext = socialData;
        this.isLoading = false;
      }
    });
  }

  private loadPublicFeedData(): Observable<any> {
    const params = {
      offset: PAGINATION_CONFIG.INITIAL_OFFSET,
      limit: PAGINATION_CONFIG.LIMIT
    };

    return this.socialService.findAllUserPublic(params, this.id).pipe(
      tap((response: SocialPostByUser) => {
        const feedData = this.feedData[FeedTab.FEED];
        feedData.posts = response.data || [];
        feedData.pagination.hasMore = (response.data?.length || 0) >= PAGINATION_CONFIG.LIMIT;
        feedData.pagination.offset = PAGINATION_CONFIG.INITIAL_OFFSET + 1;
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  private subscribeToLikeChanges(): void {
    this.likeSubscription = this.socialService.likeUpdated$.subscribe({
      next: ({ idPost, like }) => {
        const postArrays = [
          this.feedData[FeedTab.FEED].posts,
          this.feedData[FeedTab.LIKE].posts,
          this.feedData[FeedTab.SAVED].posts,
          this.feedData[FeedTab.SHARED].posts
        ];
        this.likeButtonService.updateLikeInMultipleArrays(postArrays, idPost, like);
      }
    });
  }

  // Refresh functionality
  handleRefresh(event: any): void {
    // Invalida caché para forzar recarga desde servidor
    this.socialService.invalidateProfileCache(this.id);
    this.resetAllFeeds();
    this.initializeData();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  private resetAllFeeds(): void {
    Object.keys(this.feedData).forEach(key => {
      this.feedData[key] = {
        posts: [],
        pagination: this.createInitialPaginationState()
      };
    });
  }

  // Feed management methods
  viewFeedTabs(event: string): boolean {
    if (this.isPublic) {
      this.actionNotValid();
      return false;
    }

    const validTabs = Object.values(FeedTab);
    if (validTabs.includes(event as FeedTab)) {
      this.tabFeed = event;

      const feedData = this.feedData[event];
      if (feedData.posts.length === 0 && !feedData.pagination.isLoading) {
        this.loadFeedData(event, true).subscribe();
      }

      return true;
    }
    return false;
  }

  // Data loading methods
  private findOne(): Observable<any> {
    if (this.isPublic) {
      return this.socialService.socialSummaryPublic(this.id).pipe(
        tap((data: any) => this.socialService.seatNext = data)
      );
    }

    return this.socialService.socialSummary(this.id).pipe(
      tap((data: any) => this.socialService.seatNext = data)
    );
  }

  private followersToHeader(): Observable<any> {
    if (this.isPublic) {
      this.followers = [];
      this.mutual = [];
      return new Observable(observer => observer.complete());
    }

    return this.followersService.followersToHeader(this.id).pipe(
      tap((data: any) => {
        this.followers = data.followers.data;
        this.mutual = data.mutual.data;
      }),
      catchError((error) => {
        console.error('Error loading followers:', error);
        this.followers = [];
        this.mutual = [];
        return new Observable(observer => observer.complete());
      })
    );
  }

  private followStatus(): void {
    this.socialService.followStatus(this.id).subscribe({
      next: (data: any) => {
        this.socialService.statusFollowNext = data.isFollowing;
      }
    });
  }

  // Unified feed loading method
  private loadFeedData(feedType: string, reset: boolean = false, event?: any): Observable<any> {
    if (this.isPublic && feedType !== FeedTab.FEED) {
      event?.target.complete?.();
      return new Observable(observer => observer.complete());
    }

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

    const params = {
      offset: feedData.pagination.offset,
      limit: PAGINATION_CONFIG.LIMIT
    };

    const serviceMethod = this.isPublic
      ? this.socialService.findAllUserPublic(params, this.id)
      : this.getServiceMethod(feedType)(params, this.id);

    return serviceMethod.pipe(
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
      catchError((error) => {
        feedData.pagination.isLoading = false;
        event?.target.complete?.();
        console.error('Error loading feed data:', error);

        if (error.status === 401 && this.isPublic) {
          this.navCtrl.navigateForward(['/login']);
        }

        return throwError(() => error);
      })
    );
  }

  private getServiceMethod(feedType: string): (params: any, id: string) => Observable<SocialPostByUser> {
    switch (feedType) {
      case FeedTab.FEED:
        return this.socialService.findAllUser.bind(this.socialService);
      case FeedTab.LIKE:
        return this.socialService.findAllUserLike.bind(this.socialService);
      case FeedTab.SAVED:
        return this.socialService.findAllUserSaved.bind(this.socialService);
      case FeedTab.SHARED:
        return this.socialService.findAllUserShared.bind(this.socialService);
      default:
        throw new Error(`Unknown feed type: ${feedType}`);
    }
  }

  // Load more methods
  loadMore(event: any): void {
    this.loadFeedData(FeedTab.FEED, false, event).subscribe();
  }

  loadMoreLike(event: any): void {
    this.loadFeedData(FeedTab.LIKE, false, event).subscribe();
  }

  loadMoreSaved(event: any): void {
    this.loadFeedData(FeedTab.SAVED, false, event).subscribe();
  }

  loadMoreShared(event: any): void {
    this.loadFeedData(FeedTab.SHARED, false, event).subscribe();
  }

  // Button handling methods
  clickButton(event: string): boolean {
    if (this.isPublic) {
      this.actionNotValid();
      return false;
    }

    switch (event) {
      case ButtonAction.CHAT:
        this.openChat();
        return true;
      case ButtonAction.FOLLOWING:
        this.handleFollowersAction('following');
        return true;
      case ButtonAction.FOLLOWERS:
        this.handleFollowersAction('followers');
        return true;
      case ButtonAction.FOLLOW:
        this.follow();
        return true;
      case ButtonAction.SHARE:
        this.share();
        return true;
      default:
        return false;
    }
  }

  editButton(event: string): boolean {
    if (this.showDetail || this.isPublic) {
      if (this.isPublic) this.actionNotValid();
      return false;
    }

    switch (event) {
      case EditAction.NAME:
        this.onOpenModalSeatNameComponent();
        return true;
      case EditAction.USERNAME:
        this.onOpenModalSeatUsernameComponent();
        return true;
      case EditAction.IMG_PROFILE:
        this.takePicture();
        return true;
      case EditAction.TAG_REQUESTS:
        this.onOpenModalTagRequests();
        return true;
      default:
        return false;
    }
  }

  // Modal and action methods
  private handleFollowersAction(tab: string): void {
    if (!this.showDetail) {
      this.openInternalFollowersTabs(tab);
    } else {
      this.openExternalFollowersTabs(tab);
    }
  }

  async createSocialTag(): Promise<void> {
    if (this.isPublic) {
      this.actionNotValid();
      return;
    }

    const modal = await this.modalCtrl.create({
      component: CreateSocialTagComponent,
      componentProps: { id: this.id },
      cssClass: 'modal-full-screen',
      backdropDismiss: false,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.newpost) {
      // Invalida el feed para que el nuevo post aparezca
      this.socialService.invalidateFeedCache(this.id, 'feed');
      this.findOne().subscribe();
      this.loadFeedData(FeedTab.FEED, true).subscribe();
    }
  }

  async openChat(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ChatComponent,
      backdropDismiss: true,
      cssClass: 'modal-45vh',
    });
    await modal.present();
  }

  async openInternalFollowersTabs(tab: string): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: InternalFollowersTabsComponent,
      componentProps: { tab, id: this.id }
    });
    await modal.present();
  }

  async openExternalFollowersTabs(tab: string): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ExternalFollowersTabsComponent,
      componentProps: { tab, id: this.id }
    });
    await modal.present();
  }

  private follow(): void {
    this.socialService.follow(this.seat.userInfo?.id!).subscribe({
      next: () => {
        this.findOne().subscribe();
        this.followersToHeader().subscribe();
        this.followStatus();
      }
    });
  }

  async actionNotValid(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModalActionNotValidComponent,
      cssClass: 'bg-transp'
    });
    await modal.present();
  }

  async share() {
    if (this.isPublic) {
      this.actionNotValid();
      return;
    }
    const shareUrl = `https://passaparola.app/modify-simple/${this.id}?public=true&detail=true`;
    const modal = await this.modalCtrl.create({
      component: ModalShareLinkComponent,
      componentProps: {
        shareUrl: shareUrl,
        shareText: `Hei!, ho scovato questo profilo, dimmi che ne pensi.`
      },
      cssClass: 'modal-full-screen'
    });

    await modal.present();
  }

  // Profile update methods
  private update(payload: any): void {
    const user = JSON.parse(localStorage.getItem('appPassaparola_user')!);
    this.userService.updateProfile({ ...payload, id: user.profile.id }).subscribe({
      next: (response) => {
        this.seat.userInfo!.profile = response;
        // Invalida caché para que la próxima visita cargue datos frescos
        this.socialService.invalidateProfileCache(this.id);
      }
    });
  }

  private takePicture(): void {
    this.cameraService
      .getPhoto(CameraSource.Prompt)
      .then(({ imageUrl, file }) => {
        const arrayTypeFile = file!.type.split('/');
        const type = arrayTypeFile[1];
        const path = `passaparola/profile/pictures/${uuidv4()}.${type}`;
        this.uploadPicture(file, path);
      });
  }

  private uploadPicture(pictureFile: any, path: string): Promise<void> {
    return this.uploadService.uploadFile(pictureFile!, path).then(fileUpload => {
      if (!fileUpload) {
        this.toastr.error(this.translate.instant('BUSINESS_SUGGESTION.ERROR_UP_IMG'));
        return;
      }

      if (this.seat?.userInfo?.profile) {
        this.seat.userInfo.profile.profilePictureUrlFile = fileUpload;
        this.update({ profilePictureUrlFile: path });
      }
    });
  }

  async onOpenModalSeatNameComponent(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SeatNameComponent,
      cssClass: 'modal-60vh',
      backdropDismiss: true,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.name) this.update(data);
  }

  async onOpenModalSeatUsernameComponent(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SeatUsernameComponent,
      cssClass: 'modal-60vh',
      backdropDismiss: true,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.username) this.update(data);
  }

  async onOpenModalTagRequests(): Promise<void> {
    const modal = await this.modalCtrl.create({
      componentProps: {
        id: this.id
      },
      component: TagRequestsComponent,
    });
    await modal.present();
  }
}
