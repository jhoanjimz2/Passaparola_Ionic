import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonRefresher, IonRefresherContent, IonSpinner }            from "@ionic/angular/standalone";
import { ComponentModule }                                                                                                            from 'src/app/components/component.module';
import { CommonModule }                                                                                                               from '@angular/common';
import { NgxMasonryComponent, NgxMasonryModule }                                                                                      from 'ngx-masonry';
import { Subject }                                                                                                                    from 'rxjs';
import { takeUntil, debounceTime }                                                                                                    from 'rxjs/operators';
import { SocialService }                                                                                                              from 'src/app/shared/services/social.service';
import { SocialPostByUser, SocialTag }                                                                                                from 'src/app/shared/interfaces/social/social-post';
import { LikeButtonService }                                                                                                          from 'src/app/shared/services/like-button.service';
import { PostFeedComponent }                                                                                                          from '../components/post/post-feed/post-feed.component';

@Component({
  selector: 'app-search-post',
  templateUrl: './search-post.component.html',
  styleUrls: ['./search-post.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonRefresher,
    IonRefresherContent,
    ComponentModule,
    CommonModule,
    NgxMasonryModule,
    PostFeedComponent,
    IonIcon,
    IonSpinner
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPostComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('masonry') masonry!: NgxMasonryComponent;
  @ViewChild(IonContent, { static: false }) ionContent!: IonContent;

  private destroy$ = new Subject<void>();
  private layoutSubject$ = new Subject<void>();

  // Search keyword
  searchKeyword = '';

  // Search results variables
  searchResults: SocialTag[] = [];
  private readonly LIMIT = 10;
  private page = 1;
  private lastPage = 1;
  isLoading = false;
  hasMore = true;

  // Empty state
  showEmptyState = false;
  initialLoadComplete = false;

  readonly masonryOptions = {
    itemSelector: '.masonry-item',
    columnWidth: '.grid-sizer',
    percentPosition: true,
    horizontalOrder: true,
    transitionDuration: 0,
    stagger: 30,
    initLayout: false
  };

  constructor(
    private route: ActivatedRoute,
    private socialService: SocialService,
    private likeButtonService: LikeButtonService,
    private cdr: ChangeDetectorRef
  ) {
    // Debounce para el layout del masonry
    this.layoutSubject$
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => this.masonry?.layout());
  }

  ngOnInit() {
    // Obtener el parámetro de búsqueda de la ruta
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.searchKeyword = params['keyword'] || '';
      if (this.searchKeyword) {
        this.loadSearchResults(true);
      }
    });

    this.subscribeToLikeChanges();
  }

  ngAfterViewInit() {
    this.triggerLayout();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.layoutSubject$.complete();
  }

  private subscribeToLikeChanges() {
    this.socialService.likeUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ idPost, like }) => {
          this.likeButtonService.updateLikeInMultipleArrays([this.searchResults], idPost, like);
          this.cdr.markForCheck();
        }
      });
  }

  // ==================== SEARCH RESULTS ====================

  private resetSearchState() {
    this.page = 1;
    this.lastPage = 1;
    this.hasMore = true;
    this.searchResults = [];
    this.showEmptyState = false;
    this.initialLoadComplete = false;
  }

  private loadSearchResults(reset: boolean = false, event?: any) {
    if (this.isLoading && !reset) {
      event?.target?.complete();
      return;
    }

    if (!this.searchKeyword.trim()) {
      this.showEmptyState = true;
      this.initialLoadComplete = true;
      this.cdr.markForCheck();
      event?.target?.complete();
      return;
    }

    if (reset) {
      this.resetSearchState();
    }

    this.isLoading = true;

    this.socialService.findAll({
      offset: this.page,
      limit: this.LIMIT,
      keyword: this.searchKeyword
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: SocialPostByUser) => {
          this.handleSearchResponse(response, reset);
          event?.target?.complete();
          this.triggerLayout();
        },
        error: (error) => {
          this.isLoading = false;
          this.initialLoadComplete = true;
          console.error('Error loading search results:', error);
          event?.target?.complete();
          this.cdr.markForCheck();
        }
      });
  }

  private handleSearchResponse(response: SocialPostByUser, reset: boolean) {
    const newData = response.data || [];

    this.searchResults = reset ? newData : [...this.searchResults, ...newData];
    this.lastPage = response.metadata?.lastPage || 1;

    if (this.page >= this.lastPage || newData.length < this.LIMIT) {
      this.hasMore = false;
    } else {
      this.page++;
      this.hasMore = true;
    }

    this.isLoading = false;
    this.initialLoadComplete = true;
    this.showEmptyState = this.searchResults.length === 0;
    this.cdr.markForCheck();
  }

  // ==================== REFRESH ====================

  async handleRefresh(event: any) {
    try {
      this.loadSearchResults(true, event);
    } catch (error) {
      event.target.complete();
    }
  }

  // ==================== INFINITE SCROLL ====================

  loadMore(event: any) {
    this.loadSearchResults(false, event);
  }

  // ==================== LAYOUT ====================

  onVideoLoaded() {
    this.triggerLayout();
  }

  private triggerLayout() {
    this.layoutSubject$.next();
  }

  // ==================== TRACK BY ====================

  trackByPost(index: number, post: SocialTag): string | number {
    return post.id ?? index;
  }
}
