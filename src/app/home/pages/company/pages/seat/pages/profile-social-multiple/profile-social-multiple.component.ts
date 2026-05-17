import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, OnDestroy }            from '@angular/core';
import { ChatComponent }                                                   from '../components/modals/chat/chat.component';
import { ModalController, NavController }                                  from '@ionic/angular';
import { ContactComponent }                                                from '../components/modals/contact/contact.component';
import { InternalFollowersTabsComponent }                                  from '../components/modals/internal-followers-tabs/internal-followers-tabs.component';
import { ExternalFollowersTabsComponent }                                  from '../components/modals/external-followers-tabs/external-followers-tabs.component';
import { ActivatedRoute }                                                  from '@angular/router';
import { SeatService }                                                     from 'src/app/shared/services/seat.service';
import { SeatScheduleComponent }                                           from '../components/edit-profile/seat-schedule/seat-schedule.component';
import { SeatCategoryComponent }                                           from '../components/edit-profile/seat-category/seat-category.component';
import { CategoryService }                                                 from 'src/app/shared/services/category.service';
import { SeatRewardPointsCashbackComponent }                               from '../components/edit-profile/seat-reward-points-cashback/seat-reward-points-cashback.component';
import { CameraService }                                                   from 'src/app/shared/services/camera.service';
import { TranslateModule, TranslateService }                               from '@ngx-translate/core';
import { ToastrService }                                                   from 'ngx-toastr';
import { CryptoService, UploadService }                                    from 'src/app/shared/services';
import { CameraSource }                                                    from '@capacitor/camera';
import { v4 as uuidv4 }                                                    from 'uuid';
import { SeatNameComponent }                                               from '../components/edit-profile/seat-name/seat-name.component';
import { SeatTagsComponent }                                               from '../components/edit-profile/seat-tags/seat-tags.component';
import { SeatUsernameComponent }                                           from '../components/edit-profile/seat-username/seat-username.component';
import { SeatGalleryComponent }                                            from '../components/edit-profile/seat-gallery/seat-gallery.component';
import { SeatAddressComponent }                                            from '../components/edit-profile/seat-address/seat-address.component';
import { SeatWebAddressComponent }                                         from '../components/edit-profile/seat-web-address/seat-web-address.component';
import { SeatDescriptionComponent }                                        from '../components/edit-profile/seat-description/seat-description.component';
import { SocialSummary }                                                   from 'src/app/shared/interfaces/multiple-profile-business/social-summary';
import { SocialService }                                                   from 'src/app/shared/services/social.service';
import { CacheService }                                                    from 'src/app/shared/services/cache.service';
import { CACHE_KEYS }                                                      from 'src/app/shared/constants/cache-keys';
import { SocialPostByUser, SocialTag }                                     from 'src/app/shared/interfaces/social/social-post';
import { Observable, Subscription, forkJoin, tap, catchError, throwError } from 'rxjs';
import { FollowersService }                                                from 'src/app/shared/services/followers.service';
import { SeatMessageNoVisibleComponent }                                   from '../components/edit-profile/seat-message-no-visible/seat-message-no-visible.component';
import { TagRequestsComponent }                                            from '../components/request-tags/tag-requests/tag-requests.component';
import { TabsProfileComponent }                                            from '../components/shared/tabs-profile/tabs-profile.component';
import { HeaderProfileComponent }                                          from '../components/shared/header-profile/header-profile.component';
import { ProfileFeedComponent }                                            from '../components/feed/profile-feed/profile-feed.component';
import { CompanyProfileComponent }                                         from '../components/company/company-profile/company-profile.component';
import { ShoppingProfileComponent }                                        from '../components/shopping/shopping-profile/shopping-profile.component';
import { ComponentModule }                                                 from 'src/app/components/component.module';
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
} from "@ionic/angular/standalone";
import { CommonModule }                                                    from '@angular/common';
import { CreateSocialTagComponent }                                        from 'src/app/home/pages/company/pages/seat/pages/components/create-post/create-social-tag/create-social-tag.component';
import { LikeButtonService }                                               from 'src/app/shared/services/like-button.service';
import { ModalActionNotValidComponent }                                    from 'src/app/components/modal-action-not-valid/modal-action-not-valid.component';
import { ModalShareLinkComponent }                                         from 'src/app/components/modal-share-link/modal-share-link.component';

// Enums y constantes
enum ProfileTab {
  TAGS = 'tags',
  BUSINESS = 'business',
  SHOPPING = 'shopping'
}

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
  SHARE = 'share',
  CONTACT = 'contact'
}

enum EditAction {
  TAGS = 'tags',
  NAME = 'name',
  USERNAME = 'username',
  CATEGORY = 'category',
  SCHEDULE = 'schedule',
  IMG_PROFILE = 'img-profile',
  CASHBACK = 'cashback',
  GALLERY = 'gallery',
  LOCATION = 'location',
  WEB_ADDRESS = 'web-address',
  DESCRIPTION = 'description',
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

interface PreloadedData {
  daysTranslation: any[];
  categoriesWithChildren: any[];
  suggestedTags: string[];
  menus: any[];
}

@Component({
  selector: 'app-profile-social-multiple',
  templateUrl: './profile-social-multiple.component.html',
  styleUrls: ['./profile-social-multiple.component.scss'],
  standalone: true,
  imports: [
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
    TabsProfileComponent,
    HeaderProfileComponent,
    ProfileFeedComponent,
    CompanyProfileComponent,
    ShoppingProfileComponent,
    TranslateModule,
    ComponentModule,
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileSocialMultipleComponent implements OnInit, OnDestroy {
  // Properties
  profileTabSelect: string = ProfileTab.TAGS;
  tabFeed: string = FeedTab.FEED;
  id: string = '';
  seat: SocialSummary = {} as SocialSummary;
  statusFollow: boolean = false;
  showDetail: boolean = false;
  operativeMode: boolean = false;
  followers: any[] = [];
  mutual: any[] = [];
  flag: boolean = false;

  // Preloaded data
  preloadedData: PreloadedData = {
    daysTranslation: [],
    categoriesWithChildren: [],
    suggestedTags: [],
    menus: []
  };

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

  // Getters para compatibilidad con preloaded data
  get daysTranslation(): any[] { return this.preloadedData.daysTranslation; }
  get categoriesWithChildren(): any[] { return this.preloadedData.categoriesWithChildren; }
  get suggestedTags(): string[] { return this.preloadedData.suggestedTags; }
  get menus(): any[] { return this.preloadedData.menus; }

  constructor(
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private seatService: SeatService,
    private navCtrl: NavController,
    private categoryService: CategoryService,
    private cameraService: CameraService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private uploadService: UploadService,
    private socialService: SocialService,
    private cacheService: CacheService,
    private followersService: FollowersService,
    private likeButtonService: LikeButtonService
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
    this.autoSubscribe(this.socialService.statusFollowObservable, v => this.statusFollow = v);
    this.autoSubscribe(this.socialService.seatObservable, v => this.seat = v);
    this.autoSubscribe(this.socialService.showDetailObservable, v => this.showDetail = v);
    this.autoSubscribe(this.socialService.operativeObservable, v => this.operativeMode = v);
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
      this.socialService.showDetailNext = params.detail === 'true';
      this.socialService.operativeNext = params.operative === 'true';
      this.isPublic = params['public'] === 'true';
      this.paramsLoaded = true;
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

    const baseOperations = [
      this.findOne(),
      this.loadFeedData(FeedTab.FEED, true),
      this.followersToHeader(),
      this.findAllBoards()
    ];
    const editModeOperations = this.shouldLoadEditData() ? [
      this.findAllScheduleDays(),
      this.getAllWithChildren(),
      this.findAllTags()
    ] : [];

    forkJoin([...baseOperations, ...editModeOperations]).subscribe({
      next: () => {
        if (this.showDetail || this.operativeMode) this.followStatus();
        this.isLoading = false;
      },
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
    if (this.showDetail || this.operativeMode) this.followStatus();

    return true;
  }

  private loadPublicData(): void {
    forkJoin([
      this.socialService.socialSummaryPublic(this.id),
      this.loadPublicFeedData(),
      this.findAllBoardsPublic()
    ]).subscribe({
      next: ([socialData, _, __]) => {
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

  private shouldLoadEditData(): boolean {
    return !this.showDetail && !this.operativeMode;
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

  // Section buttons
  onSave(): void {
    if (this.showDetail || this.isPublic) {
      if (this.isPublic) this.actionNotValid();
      return;
    }
    this.navCtrl.navigateForward(['/pages/company/seat']);
  }

  onPublish(): void {
    if (this.showDetail || this.isPublic) {
      if (this.isPublic) this.actionNotValid();
      return;
    }

    const seatInfo = this.seat?.targetInfo?.seatInfo;
    const isPhysical = seatInfo?.type?.description === 'physical';
    const isEcommerce = seatInfo?.type?.description === 'ecommerce';

    const requiredFieldsValid = this.validateRequiredFields(seatInfo, isPhysical, isEcommerce);

    if (requiredFieldsValid) {
      this.update({ targetInfo: { seatInfo: { isVisible: true } } }, true);
    } else {
      this.onOpenModalSeatMessageNoVisibleComponent(seatInfo?.id!);
    }
  }

  private validateRequiredFields(seatInfo: any, isPhysical: boolean, isEcommerce: boolean): boolean {
    const baseFields = [
      seatInfo?.description?.length,
      seatInfo?.name?.length,
      seatInfo?.pictureGallery?.length,
      seatInfo?.pictureUlrFile?.length,
      seatInfo?.schedule?.length,
      seatInfo?.tags?.length
    ];

    const locationField = isPhysical ? seatInfo?.address?.length :
                         isEcommerce ? seatInfo?.webAddress?.length : true;

    return baseFields.every(Boolean) && Boolean(locationField);
  }

  async onOpenModalSeatMessageNoVisibleComponent(id: string): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SeatMessageNoVisibleComponent,
      cssClass: 'modal-60vh',
      backdropDismiss: true,
    });
    await modal.present();
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

  private findAllBoards(): Observable<any> {
    return this.seatService.findAllBoards(this.id).pipe(
      tap((data: any) => this.preloadedData.menus = data)
    );
  }

  private findAllBoardsPublic(): Observable<any> {
    return this.seatService.findAllBoardsPublic(this.id).pipe(
      tap((data: any) => this.preloadedData.menus = data)
    );
  }

  // Preload data methods
  private findAllScheduleDays(): Observable<any> {
    return this.seatService.findAllScheduleDays().pipe(
      tap((data: any) => this.preloadedData.daysTranslation = data)
    );
  }

  private getAllWithChildren(): Observable<any> {
    return this.categoryService.getAllWithChildren().pipe(
      tap((categories: any) => {
        this.preloadedData.categoriesWithChildren = categories.map((category: any) =>
          this.transformCategory(category)
        );
      })
    );
  }

  private transformCategory(category: any): any {
    category.companyCategoryTranslation = category.companyCategoryTranslation[0];
    if (category.children && category.children.length > 0) {
      category.children = category.children.map((child: any) =>
        this.transformCategory(child)
      );
    }
    return category;
  }

  private findAllTags(): Observable<any> {
    return this.seatService.findAllTags().pipe(
      tap((response) => {
        this.preloadedData.suggestedTags = response
          .map((t: any) => t.description)
          .sort();
      })
    );
  }

  // Feed management methods
  viewProfile(event: string): boolean {
    if (this.isPublic) {
      this.actionNotValid();
      return false;
    }

    switch (event) {
      case ButtonAction.CONTACT:
        this.openContact();
        return true;
      case ProfileTab.TAGS:
        this.profileTabSelect = ProfileTab.TAGS;
        return true;
      case ProfileTab.BUSINESS:
        this.profileTabSelect = ProfileTab.BUSINESS;
        return true;
      case ProfileTab.SHOPPING:
        this.profileTabSelect = ProfileTab.SHOPPING;
        return true;
      default:
        return false;
    }
  }

  viewFeedTabs(event: string): boolean {
    if (this.isPublic) {
      this.actionNotValid();
      return false;
    }

    const validTabs = Object.values(FeedTab);
    if (validTabs.includes(event as FeedTab)) {
      this.tabFeed = event;

      // Carga lazy: solo dispara si el tab está vacío y no está cargando
      const feedData = this.feedData[event];
      if (feedData.posts.length === 0 && !feedData.pagination.isLoading) {
        this.loadFeedData(event, true).subscribe();
      }

      return true;
    }
    return false;
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

  // Create post
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
    if (this.showDetail || this.operativeMode || this.isPublic) {
      if (this.isPublic) this.actionNotValid();
      return false;
    }

    const editActions: Record<string, () => Promise<void> | void> = {
      [EditAction.TAGS]: () => this.onOpenModalSeatTags(),
      [EditAction.NAME]: () => this.onOpenModalSeatNameComponent(),
      [EditAction.USERNAME]: () => this.onOpenModalSeatUsernameComponent(),
      [EditAction.CATEGORY]: () => this.onSeatCategory(),
      [EditAction.SCHEDULE]: () => this.onSeatSchedule(),
      [EditAction.IMG_PROFILE]: () => this.takePicture(),
      [EditAction.CASHBACK]: () => this.onSeatRewardPointsCashback(),
      [EditAction.GALLERY]: () => this.onOpenModalSeatGalleryComponent(),
      [EditAction.LOCATION]: () => this.onSeatAddressComponent(),
      [EditAction.WEB_ADDRESS]: () => this.onOpenModalSeatWebAddressComponent(),
      [EditAction.DESCRIPTION]: () => this.onOpenModalSeatDescriptionComponent(),
      [EditAction.TAG_REQUESTS]: () => this.onOpenModalTagRequests()
    };

    const action = editActions[event];
    if (action) {
      action();
      return true;
    }
    return false;
  }

  // Modal and action methods
  private handleFollowersAction(tab: string): void {
    if (!this.showDetail) {
      this.openInternalFollowersTabs(tab);
    } else {
      this.openExternalFollowersTabs(tab);
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

  async openContact(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ContactComponent,
      backdropDismiss: true,
      cssClass: 'modal-45vh',
    });
    await modal.present();
  }

  private follow(): void {
    this.socialService.follow(this.seat.targetInfo?.seatInfo?.id!).subscribe({
      next: () => {
        this.findOne().subscribe();
        this.followersToHeader().subscribe();
        this.followStatus();
      }
    });
  }

  async share(): Promise<void> {
    if (this.isPublic) {
      this.actionNotValid();
      return;
    }

    const shareUrl = `https://passaparola.app/modify/${this.id}?public=true&detail=true`;
    console.log(shareUrl);
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

  // Update methods
  update(payload: SocialSummary, goToList?: boolean): void {
    const cleanPayload = { ...payload };
    const seatInfo = cleanPayload.targetInfo?.seatInfo;

    if (seatInfo) {
      delete seatInfo.updatedAt;
      delete seatInfo.id;
      delete seatInfo.pin;
      delete seatInfo.createdAt;
    }

    this.seatService.update(this.id, seatInfo).subscribe({
      next: (response) => {
        this.seat.targetInfo!.seatInfo = response;
        // Invalida caché para que la próxima visita cargue datos frescos
        this.socialService.invalidateProfileCache(this.id);
        if (goToList) this.onSave();
      }
    });
  }

  private takePicture(): void {
    this.cameraService
      .getPhoto(CameraSource.Prompt)
      .then(({ imageUrl, file }) => {
        const arrayTypeFile = file!.type.split('/');
        const type = arrayTypeFile[1];
        const path = `passaparola/company/seats/picture/${uuidv4()}.${type}`;
        this.uploadPicture(file, path);
      })
      .catch((err) => {
        console.error('Camera error:', err);
      });
  }

  private async uploadPicture(pictureFile: any, path: string): Promise<void> {
    const fileUpload = await this.uploadService.uploadFile(pictureFile!, path);
    if (!fileUpload) {
      this.toastr.error(this.translate.instant('BUSINESS_SUGGESTION.ERROR_UP_IMG'));
      return;
    }
    this.seat.targetInfo!.seatInfo!.pictureUlrFile = fileUpload;
    this.update(this.seat);
  }

  // Modal opening methods
  async onSeatSchedule(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SeatScheduleComponent,
      cssClass: 'modal-85vh',
      backdropDismiss: true,
      componentProps: {
        schedule: this.seat.targetInfo?.seatInfo!.schedule,
        daysTranslation: this.daysTranslation,
      },
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.schedule) {
      this.update({ targetInfo: { seatInfo: { schedule: data.schedule } } });
    }
  }

  async onSeatCategory(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SeatCategoryComponent,
      cssClass: 'modal-95vh',
      backdropDismiss: true,
      componentProps: {
        categoriesWithChildren: this.categoriesWithChildren,
        selectedCategories: this.seat.targetInfo?.seatInfo!.categories,
      },
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.categories) {
      this.update({ targetInfo: { seatInfo: { categories: data.categories } } });
    }
  }

  async onSeatRewardPointsCashback(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SeatRewardPointsCashbackComponent,
      cssClass: this.seat.targetInfo?.seatInfo?.tags?.length ? 'modal-75vh' : 'modal-85vh',
      backdropDismiss: true
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.next) {
      this.update({ targetInfo: { seatInfo: { ...data.percentages } } });
    }
  }

  async onOpenModalSeatNameComponent(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SeatNameComponent,
      cssClass: 'modal-60vh',
      backdropDismiss: true,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.name) {
      this.update({ targetInfo: { seatInfo: { name: data.name } } });
    }
  }

  async onOpenModalSeatUsernameComponent(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SeatUsernameComponent,
      cssClass: 'modal-60vh',
      backdropDismiss: true,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
  }

  async onOpenModalSeatTags(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SeatTagsComponent,
      cssClass: 'modal-95vh',
      backdropDismiss: true,
      componentProps: {
        selectedTags: this.seat.targetInfo?.seatInfo?.tags,
        suggestedTags: this.suggestedTags,
      },
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.tags) {
      this.update({ targetInfo: { seatInfo: { tags: data.tags } } });
    }
  }

  async onOpenModalSeatGalleryComponent(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SeatGalleryComponent,
      cssClass: 'modal-60vh',
      backdropDismiss: true,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.pictureGallery) {
      this.update({ targetInfo: { seatInfo: { pictureGallery: data.pictureGallery } } });
    }
  }

  async onSeatAddressComponent(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SeatAddressComponent,
      cssClass: 'modal-60vh',
      backdropDismiss: true
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.address) {
      this.update({
        targetInfo: {
          seatInfo: {
            address: data.address,
            latitude: data.center.lat.toString(),
            longitude: data.center.lng.toString(),
          }
        }
      });
    }
  }

  async onOpenModalSeatWebAddressComponent(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SeatWebAddressComponent,
      cssClass: 'modal-60vh',
      backdropDismiss: true,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.webAddress) {
      this.update({ targetInfo: { seatInfo: { webAddress: data.webAddress } } });
    }
  }

  async onOpenModalSeatDescriptionComponent(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: SeatDescriptionComponent,
      cssClass: 'modal-60vh',
      backdropDismiss: true,
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data?.description) {
      this.update({ targetInfo: { seatInfo: { description: data.description } } });
    }
  }

  async onOpenModalTagRequests(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: TagRequestsComponent,
    });
    await modal.present();
  }

  async actionNotValid(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ModalActionNotValidComponent,
      cssClass: 'bg-transp'
    });
    await modal.present();
  }
}
