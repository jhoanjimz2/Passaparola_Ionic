import { Component, OnInit, ViewChild, OnDestroy }                                                    from '@angular/core';
import { ActivatedRoute }                                                                             from '@angular/router';
import { IonContent, IonRefresher, IonRefresherContent, IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/angular/standalone";
import { CommonModule }                                                                               from '@angular/common';
import { HeaderComponent }                                                                            from '../../components/header/header.component';
import { FeedWillbuyComponent }                                                                       from '../../components/feed-willbuy/feed-willbuy.component';
import { SearchBarComponent }                                                                         from '../../components/search-bar/search-bar.component';
import { JointlybuyService }                                                                          from 'src/app/shared/services/jointlybuy.service';
import { Willbuy }                                                                                    from 'src/app/shared/interfaces/jointlybuy/willbuy';
import { Observable, Subscription }                                                                   from 'rxjs';

@Component({
  selector: 'app-view-willbuys-category',
  templateUrl: './view-willbuys-category.page.html',
  styleUrls: ['./view-willbuys-category.page.scss'],
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
    SearchBarComponent
  ]
})
export class ViewWillbuysCategoryPage implements OnInit, OnDestroy {
  @ViewChild(FeedWillbuyComponent) feedComponent!: FeedWillbuyComponent;

  categoryId!: string;
  willbuys: Willbuy[] = [];

  // Paginación
  currentPage = 1;
  pageSize = 10;
  isLoading = false;
  hasMoreData = true;

  // Búsqueda
  isSearchMode = false;
  searchKeyword = '';

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private jointlybuyService: JointlybuyService
  ) {}

  ngOnInit(): void {
    // Obtener el categoryId de la ruta
    this.categoryId = this.route.snapshot.paramMap.get('id')!;

    // Escuchar cambios en el parámetro de la ruta
    const paramsSub = this.route.paramMap.subscribe(params => {
      const newCategoryId = params.get('id');

      if (newCategoryId && this.categoryId !== newCategoryId) {
        this.categoryId = newCategoryId;
        this.resetAndLoad();
      }
    });

    this.subscriptions.push(paramsSub);

    // Suscribirse al observable de willbuys por categoría
    const willbuysSub = this.jointlybuyService.allWillbuyByCategory().subscribe({
      next: (willbuys: Willbuy[]) => {
        this.willbuys = willbuys;
        setTimeout(() => this.feedComponent?.triggerLayout(), 100);
      }
    });

    this.subscriptions.push(willbuysSub);

    // Carga inicial
    this.loadWillbuys();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.jointlybuyService.clearWillbuysByCategory();
  }

  // Función de búsqueda que se pasa al SearchBarComponent
  searchWillbuys = (params: any): Observable<any> => {
    return this.jointlybuyService.loadWillbuysSearchBar(params);
  }

  // Cuando se selecciona un resultado de búsqueda
  onResultSelected(willbuy: Willbuy): void {
    console.log('Resultado seleccionado:', willbuy);
  }

  // Cuando comienza una búsqueda
  onSearchStarted(keyword: string): void {
    this.isSearchMode = true;
    this.searchKeyword = keyword;
  }

  // Cuando completa una búsqueda
  onSearchCompleted(results: Willbuy[]): void {
    console.log('Búsqueda completada:', results.length, 'resultados');
  }

  // Método para resetear y recargar cuando cambia la categoría
  private resetAndLoad(): void {
    this.jointlybuyService.clearWillbuysByCategory();
    this.currentPage = 1;
    this.hasMoreData = true;
    this.isSearchMode = false;
    this.searchKeyword = '';
    this.loadWillbuys(false);
  }

  // Cargar willbuys por categoría
  private loadWillbuys(reset = false): void {
    if (this.isLoading) return;

    if (reset) {
      this.currentPage = 1;
      this.hasMoreData = true;
      this.isSearchMode = false;
      this.searchKeyword = '';
      this.jointlybuyService.clearWillbuysByCategory();
    }

    this.isLoading = true;
    const accumulate = !reset && this.currentPage > 1;

    const params: any = {
      limit: this.pageSize,
      offset: this.currentPage,
      keyword: '',
      languageCode: 'IT',
      category: this.categoryId
    };

    const sub = this.jointlybuyService.loadWillbuys(params, accumulate).subscribe({
      next: (respWillbuy) => {
        const newDataLength = respWillbuy.data?.length || 0;
        if (newDataLength < this.pageSize) {
          this.hasMoreData = false;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });

    this.subscriptions.push(sub);
  }

  // Pull to refresh
  handleRefresh(event: any): void {
    this.loadWillbuys(true);

    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }

  // Infinite scroll
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
      languageCode: 'IT',
      category: this.categoryId
    };

    const sub = this.jointlybuyService.loadWillbuys(params, true).subscribe({
      next: (respWillbuy) => {
        const newDataLength = respWillbuy.data?.length || 0;
        if (newDataLength < this.pageSize) {
          this.hasMoreData = false;
        }
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      }
    });

    this.subscriptions.push(sub);
  }
}
