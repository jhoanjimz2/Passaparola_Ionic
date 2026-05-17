import { Component, Input }                                                 from '@angular/core';
import { ProfileFeedMenuTagsComponent }                                     from '../profile-feed-menu-tags/profile-feed-menu-tags.component';
import { CommonModule }                                                     from '@angular/common';
import { InvestmentTagComponent }                                           from "../../tags/investment-tag/investment-tag.component";
import { ProductTagComponent }                                              from "../../tags/product-tag/product-tag.component";
import { StoreTagComponent }                                                from "../../tags/store-tag/store-tag.component";
import { EventTagComponent }                                                from "../../tags/event-tag/event-tag.component";
import { ActivatedRoute }                                                   from '@angular/router';
import { catchError, Observable, Subscription, switchMap, tap, throwError } from 'rxjs';
import { SocialService }                                                    from 'src/app/shared/services/social.service';
import { IonInfiniteScroll, IonInfiniteScrollContent, NavController }       from "@ionic/angular/standalone";

enum FeedTab {
  PRODUCTS = 'products',
  STORES = 'stores',
  EVENTS = 'events',
  PROJECTS = 'projects'
}

interface PaginationState {
  offset: number;
  isLoading: boolean;
  hasMore: boolean;
}

interface FeedData {
  tags: any[];
  pagination: PaginationState;
}

const PAGINATION_CONFIG = {
  LIMIT: 10,
  INITIAL_OFFSET: 1
};

@Component({
  selector: 'app-profile-feed-tags',
  templateUrl: './profile-feed-tags.component.html',
  styleUrls: ['./profile-feed-tags.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    ProfileFeedMenuTagsComponent,
    InvestmentTagComponent,
    ProductTagComponent,
    StoreTagComponent,
    EventTagComponent
  ]
})
export class ProfileFeedTagsComponent {
  @Input() active = false;
  @Input() isPublic = false;

  tabMenuTag: string = FeedTab.PRODUCTS;
  id: string = '';

  // Feed data con estructura optimizada
  feedData: Record<string, FeedData> = {
    [FeedTab.PRODUCTS]: {
      tags: [],
      pagination: this.createInitialPaginationState()
    },
    [FeedTab.EVENTS]: {
      tags: [],
      pagination: this.createInitialPaginationState()
    },
    [FeedTab.PROJECTS]: {
      tags: [],
      pagination: this.createInitialPaginationState()
    },
    [FeedTab.STORES]: {
      tags: [],
      pagination: this.createInitialPaginationState()
    }
  };

  get products(): any[] { return this.feedData[FeedTab.PRODUCTS].tags; }
  get events(): any[] { return this.feedData[FeedTab.EVENTS].tags; }
  get projects(): any[] { return this.feedData[FeedTab.PROJECTS].tags; }
  get stores(): any[] { return this.feedData[FeedTab.STORES].tags; }

  get hasMoreProducts(): boolean { return this.feedData[FeedTab.PRODUCTS].pagination.hasMore; }
  get hasMoreEvents(): boolean { return this.feedData[FeedTab.EVENTS].pagination.hasMore; }
  get hasMoreProjects(): boolean { return this.feedData[FeedTab.PROJECTS].pagination.hasMore; }
  get hasMoreStores(): boolean { return this.feedData[FeedTab.STORES].pagination.hasMore; }

  private subscriptions: Subscription[] = [];
  showDetail: boolean = false;

  constructor(
    private socialService: SocialService,
    private navCtrl: NavController
  ) {
    this.initializeObservables();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private initializeObservables(): void {
    this.autoSubscribe(this.socialService.showDetailObservable, v => this.showDetail = v);
  }

  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void): void {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }

  private initializeData(): void {
    this.loadFeedData(FeedTab.PRODUCTS, true).pipe(
      switchMap(() => {
        return new Observable(observer => observer.complete());
      })
    ).subscribe();
  }

  setMenuTag(tab: string): void {
    this.tabMenuTag = tab;
    const feedData = this.feedData[tab];
    if (feedData && feedData.tags.length === 0 && !feedData.pagination.isLoading) {
      this.loadFeedData(tab, true).subscribe();
    }
  }

  private createInitialPaginationState(): PaginationState {
    return {
      offset: PAGINATION_CONFIG.INITIAL_OFFSET,
      isLoading: false,
      hasMore: true
    };
  }

  private loadFeedData(feedType: string, reset: boolean = false, event?: any): Observable<any> {
    const feedData = this.feedData[feedType];

    if (!feedData || feedData.pagination.isLoading || (!feedData.pagination.hasMore && !reset)) {
      event?.target?.complete?.();
      return new Observable(observer => observer.complete());
    }

    if (reset) {
      feedData.pagination = this.createInitialPaginationState();
      feedData.tags = [];
    }

    feedData.pagination.isLoading = true;

    const params = {
      offset: feedData.pagination.offset,
      limit: PAGINATION_CONFIG.LIMIT
    };

    const serviceMethod = this.isPublic
      ? this.getPublicServiceMethod(feedType)
      : this.getServiceMethod(feedType);

    return serviceMethod(params, this.id).pipe(
      tap((response: any) => {
        const newData = response.data || [];
        feedData.tags = [...feedData.tags, ...newData];

        if (newData.length < PAGINATION_CONFIG.LIMIT) {
          feedData.pagination.hasMore = false;
        } else {
          feedData.pagination.offset++;
        }

        feedData.pagination.isLoading = false;
        event?.target?.complete?.();
      }),
      catchError((error) => {
        feedData.pagination.isLoading = false;
        event?.target?.complete?.();
        if (error.status === 401 && this.isPublic) {
          this.navCtrl.navigateForward(['/login']);
        }

        return throwError(() => error);
      })
    );
  }

  private getServiceMethod(feedType: string): (params: any, id: string) => Observable<any> {
    switch (feedType) {
      case FeedTab.PRODUCTS:
        return this.socialService.productsTagByUser.bind(this.socialService);
      case FeedTab.EVENTS:
        return this.socialService.eventsTagByUser.bind(this.socialService);
      case FeedTab.PROJECTS:
        return this.socialService.projectsTagByUser.bind(this.socialService);
      case FeedTab.STORES:
        return this.socialService.storesTagByUser.bind(this.socialService);
      default:
        throw new Error(`Unknown feed type: ${feedType}`);
    }
  }

  private getPublicServiceMethod(feedType: string): (params: any, id: string) => Observable<any> {
    switch (feedType) {
      case FeedTab.PRODUCTS:
        return this.socialService.productsTagByUserPublic.bind(this.socialService);
      case FeedTab.EVENTS:
        return this.socialService.eventsTagByUserPublic.bind(this.socialService);
      case FeedTab.PROJECTS:
        return this.socialService.projectsTagByUserPublic.bind(this.socialService);
      case FeedTab.STORES:
        return this.socialService.storesTagByUserPublic.bind(this.socialService);
      default:
        throw new Error(`Unknown feed type: ${feedType}`);
    }
  }

  loadMoreProducts(event: any): void {
    this.loadFeedData(FeedTab.PRODUCTS, false, event).subscribe();
  }

  loadMoreEvents(event: any): void {
    this.loadFeedData(FeedTab.EVENTS, false, event).subscribe();
  }

  loadMoreProjects(event: any): void {
    this.loadFeedData(FeedTab.PROJECTS, false, event).subscribe();
  }

  loadMoreStores(event: any): void {
    this.loadFeedData(FeedTab.STORES, false, event).subscribe();
  }

  goStore(id: string): void {
    this.navCtrl.navigateForward(['/pages/company/seat/modify', id], {
      queryParams: { detail: true },
    });
  }
}
