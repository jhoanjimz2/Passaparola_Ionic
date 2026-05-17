import { Component, ViewChild, OnDestroy }                                                                                           from '@angular/core';
import { IonContent, IonIcon, IonFabButton, IonFab, IonRefresher, IonRefresherContent, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { HeaderComponent }                                                                                                           from '../../components/header/header.component';
import { CommonModule }                                                                                                              from '@angular/common';
import { SlideCategoryComponent }                                                                                                    from '../../components/slide-category/slide-category.component';
import { RouterLink }                                                                                                                from '@angular/router';
import { WillbuyPopularComponent }                                                                                                   from '../../components/willbuy-popular/willbuy-popular.component';
import { FeedWillbuyComponent }                                                                                                      from '../../components/feed-willbuy/feed-willbuy.component';
import { JointlybuyService }                                                                                                         from 'src/app/shared/services/jointlybuy.service';
import { Willbuy }                                                                                                                   from 'src/app/shared/interfaces/jointlybuy/willbuy';
import { Subscription }                                                                                                              from 'rxjs';
import { WillbuyDeadlineComponent }                                                                                                  from '../../components/willbuy-deadline/willbuy-deadline.component';
import { NotificationType, WishbuyWillbuyNotificationType }                                                                          from 'src/app/shared/interfaces/jointlybuy/notifications';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonRefresherContent,
    IonRefresher,
    IonFab,
    IonFabButton,
    IonContent,
    HeaderComponent,
    IonIcon,
    CommonModule,
    SlideCategoryComponent,
    WillbuyDeadlineComponent,
    WillbuyPopularComponent,
    RouterLink,
    FeedWillbuyComponent
  ]
})
export class HomePage implements OnDestroy {
  @ViewChild(FeedWillbuyComponent) feedComponent!: FeedWillbuyComponent;

  willbuys: Willbuy[] = [];
  private subscriptions: Subscription[] = [];

  currentPage = 1;
  pageSize = 10;
  isLoading = false;
  hasMoreData = true;

  constructor(
    private jointlybuyService: JointlybuyService
  ) {
    this.initializeData();
  }

  private initializeData() {
    this.jointlybuyService.loadWillbuysDeadline({
      limit: 10,
      offset: 1,
      keyword: '',
      languageCode: 'IT'
    }).subscribe();
    this.jointlybuyService.loadWillbuysPopular({
      limit: 10,
      offset: 1,
      keyword: '',
      languageCode: 'IT'
    }).subscribe();
    this.jointlybuyService.loadCategoryWillbuy({
      limit: 100000000000,
      offset: 1,
      keyword: '',
      languageCode: 'IT'
    }).subscribe();
    this.jointlybuyService.getNotifications({
      limit: 100000000000,
      offset: 1,
      languageCode: 'IT',
      type: NotificationType.all,
      wishbuyWillbuyNotificationType: WishbuyWillbuyNotificationType.all
    }).subscribe();

    this.loadFeedWillbuys();
  }

  private loadFeedWillbuys(reset = false) {
    if (this.isLoading) return;

    if (reset) {
      this.currentPage = 1;
      this.hasMoreData = true;
      this.jointlybuyService.clearWillbuys();
    }

    this.isLoading = true;

    const accumulate = !reset && this.currentPage > 1;

    const sub = this.jointlybuyService.loadWillbuys({
      limit: this.pageSize,
      offset: this.currentPage,
      keyword: '',
      languageCode: 'IT'
    }, accumulate).subscribe({
      next: () => {
        const allWillbuysSub = this.jointlybuyService.allWillbuy().subscribe({
          next: (willbuys: Willbuy[]) => {
            this.willbuys = willbuys;

            if (accumulate && willbuys.length === this.willbuys.length) {
              this.hasMoreData = false;
            }
            this.isLoading = false;
            setTimeout(() => this.feedComponent?.triggerLayout(), 100);
          },
          error: () => this.isLoading = false
        });
        this.subscriptions.push(allWillbuysSub);
      },
      error: () => this.isLoading = false
    });

    this.subscriptions.push(sub);
  }

  handleRefresh(event: any) {
    this.loadFeedWillbuys(true);

    this.jointlybuyService.loadWillbuysDeadline({
      limit: 10,
      offset: 1,
      keyword: '',
      languageCode: 'IT'
    }).subscribe();

    this.jointlybuyService.loadWillbuysPopular({
      limit: 10,
      offset: 1,
      keyword: '',
      languageCode: 'IT'
    }).subscribe();

    this.jointlybuyService.loadCategoryWillbuy({
      limit: 100000000000,
      offset: 1,
      keyword: '',
      languageCode: 'IT'
    }).subscribe();

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  loadMoreData(event: any) {
    if (!this.hasMoreData || this.isLoading) {
      event.target.complete();
      return;
    }

    this.currentPage++;

    const currentLength = this.willbuys.length;

    const sub = this.jointlybuyService.loadWillbuys({
      limit: this.pageSize,
      offset: this.currentPage,
      keyword: '',
      languageCode: 'IT'
    }, true).subscribe({
      next: () => {
        const allWillbuysSub = this.jointlybuyService.allWillbuy().subscribe({
          next: (willbuys: Willbuy[]) => {
            this.willbuys = willbuys;

            if (willbuys.length === currentLength) {
              this.hasMoreData = false;
            }
            setTimeout(() => this.feedComponent?.triggerLayout(), 100);
            event.target.complete()
          },
          error: () => event.target.complete()
        });
        this.subscriptions.push(allWillbuysSub);
      },
      error: () => event.target.complete()
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
