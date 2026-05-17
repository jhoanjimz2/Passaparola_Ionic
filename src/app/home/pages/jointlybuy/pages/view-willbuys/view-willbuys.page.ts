import { Component, OnInit, ViewChild, OnDestroy }                                                    from '@angular/core';
import { IonContent, IonRefresher, IonRefresherContent, IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/angular/standalone";
import { CommonModule }                                                                               from '@angular/common';
import { HeaderComponent }                                                                            from '../../components/header/header.component';
import { FeedWillbuyComponent }                                                                       from '../../components/feed-willbuy/feed-willbuy.component';
import { SlideCategoryComponent }                                                                     from '../../components/slide-category/slide-category.component';
import { SearchBarComponent }                                                                         from '../../components/search-bar/search-bar.component';
import { JointlybuyService }                                                                          from 'src/app/shared/services/jointlybuy.service';
import { Willbuy }                                                                                    from 'src/app/shared/interfaces/jointlybuy/willbuy';
import { Observable, Subscription }                                                                   from 'rxjs';

@Component({
  selector: 'app-view-willbuys',
  templateUrl: './view-willbuys.page.html',
  styleUrls: ['./view-willbuys.page.scss'],
  standalone: true,
  imports: [
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    IonRefresherContent,
    IonRefresher,
    IonContent,
    CommonModule,
    FeedWillbuyComponent,
    HeaderComponent,
    SlideCategoryComponent,
    SearchBarComponent
  ]
})
export class ViewWillbuysPage implements OnInit, OnDestroy {
  @ViewChild(FeedWillbuyComponent) feedComponent!: FeedWillbuyComponent;

  willbuys: Willbuy[] = [];

  currentPage = 1;
  pageSize = 10;
  isLoading = false;
  hasMoreData = true;

  isSearchMode = false;
  searchKeyword = '';

  private subscriptions: Subscription[] = [];

  constructor(
    private jointlybuyService: JointlybuyService
  ) {}

  ngOnInit(): void {
    const willbuysSub = this.jointlybuyService.allWillbuy().subscribe({
      next: (willbuys: Willbuy[]) => {
        this.willbuys = willbuys;
        setTimeout(() => this.feedComponent?.triggerLayout(), 100);
      }
    });

    this.subscriptions.push(willbuysSub);

    this.loadWillbuys();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  searchWillbuys = (params: any): Observable<any> => {
    return this.jointlybuyService.loadWillbuysSearchBar(params);
  }

  onResultSelected(willbuy: Willbuy): void {
    console.log('Resultado seleccionado:', willbuy);
  }

  onSearchStarted(keyword: string): void {
    this.isSearchMode = true;
    this.searchKeyword = keyword;
  }

  onSearchCompleted(results: Willbuy[]): void {
    console.log('Búsqueda completada:', results.length, 'resultados');
  }

  private loadWillbuys(reset = false): void {
    if (this.isLoading) return;

    if (reset) {
      this.currentPage = 1;
      this.hasMoreData = true;
      this.isSearchMode = false;
      this.searchKeyword = '';
      this.jointlybuyService.clearWillbuys();
    }

    this.isLoading = true;
    const accumulate = !reset && this.currentPage > 1;

    const params: any = {
      limit: this.pageSize,
      offset: this.currentPage,
      keyword: '',
      languageCode: 'IT'
    };

    const sub = this.jointlybuyService.loadWillbuys(params, accumulate).subscribe({
      next: (respWillbuy) => {
        const newDataLength = respWillbuy.data?.length || 0;
        if (newDataLength < this.pageSize) {
          this.hasMoreData = false;
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });

    this.subscriptions.push(sub);
  }

  handleRefresh(event: any): void {
    this.loadWillbuys(true);

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  loadMoreData(event: any): void {
    if (!this.hasMoreData || this.isLoading || this.isSearchMode) {
      event.target.complete();
      return;
    }

    this.currentPage++;

    const params: any = {
      limit: this.pageSize,
      offset: this.currentPage,
      keyword: '',
      languageCode: 'IT'
    };

    const sub = this.jointlybuyService.loadWillbuys(params, true).subscribe({
      next: (respWillbuy) => {
        const newDataLength = respWillbuy.data?.length || 0;
        if (newDataLength < this.pageSize) {
          this.hasMoreData = false;
        }
        event.target.complete();
      },
      error: () => event.target.complete()
    });

    this.subscriptions.push(sub);
  }
}
