// professionals.page.ts
import { Component, OnDestroy, OnInit, ViewChild }                 from '@angular/core';
import { CommonModule }                                            from '@angular/common';
import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { SearchBarComponent }                                      from '../../components/search-bar/search-bar.component';
import { ProfessionalCardComponent }                               from '../../components/professional-card/professional-card.component';
import { SlideCategoryComponent }                                  from '../../components/slide-category/slide-category.component';
import { Professional, ProfessionalFilters }                       from 'src/app/shared/interfaces/professionals/professionals';
import { FilterByComponent }                                       from '../../components/filter-by/filter-by.component';
import { ModalController }                                         from '@ionic/angular';
import { ProfessionalsWantedComponent }                            from '../../components/professionals-wanted/professionals-wanted.component';
import { ProfessionalsService }                                    from 'src/app/shared/services/professionals.service';
import { Subject, takeUntil }                                      from 'rxjs';

@Component({
  selector: 'app-professionals',
  templateUrl: './professionals.page.html',
  styleUrls: ['./professionals.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    CommonModule,
    SlideCategoryComponent,
    SearchBarComponent,
    ProfessionalCardComponent
  ]
})
export class ProfessionalsPage implements OnInit, OnDestroy {

  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  professionals: Professional[] = [];
  filteredProfessionals: Professional[] = [];

  currentSearchQuery: string = '';
  appliedFilters: ProfessionalFilters | null = null;

  isLoading: boolean = false;
  currentPage: number = 1;
  limit: number = 10;
  totalPages: number = 1;
  hasMoreData: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(
    private modalCtrl: ModalController,
    private professionalsService: ProfessionalsService
  ) {}

  ngOnInit() {
    this.loadInitialData();
    this.subscribeToMetadata();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData() {
    // Cargar categorías
    this.professionalsService.loadCategoryProfessional({
      limit: 10000,
      offset: 1,
      languageCode: 'IT'
    }).subscribe({
      error: (err) => console.error('Error cargando categorías:', err)
    });

    // Cargar profesionales iniciales
    this.loadProfessionals(1, true);
  }

  private subscribeToMetadata() {
    this.professionalsService.professionalsMetadata()
      .pipe(takeUntil(this.destroy$))
      .subscribe(metadata => {
        if (metadata) {
          this.totalPages = metadata.lastPage || 1;
          this.hasMoreData = this.currentPage < this.totalPages;
        }
      });
  }

  private loadProfessionals(page: number = 1, reset: boolean = false) {
    if (this.isLoading) return;

    this.isLoading = true;
    // offset empieza desde 1, no desde 0
    const offset = page;

    this.professionalsService.loadProfessionals({
      limit: this.limit,
      offset,
      keyword: this.currentSearchQuery,
      languageCode: 'IT'
    }).subscribe({
      next: (response) => {
        if (reset) {
          this.professionals = response.data || [];
        } else {
          this.professionals = [...this.professionals, ...(response.data || [])];
        }

        this.currentPage = page;
        this.applyFilters();
        this.isLoading = false;

        if (response.metadata) {
          this.totalPages = response.metadata.lastPage || 1;
          this.hasMoreData = page < this.totalPages;
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.hasMoreData = false;
      }
    });
  }

  private applyFilters() {
    let filtered = [...this.professionals];

    if (this.appliedFilters) {
      filtered = this.filterByCustomFilters(filtered, this.appliedFilters);
    }

    this.filteredProfessionals = filtered;
  }

  private filterByCustomFilters(professionals: Professional[], filters: ProfessionalFilters): Professional[] {
    let filtered = [...professionals];

    // Filtro por servicio a domicilio
    if (filters.homeService !== null) {
      filtered = filtered.filter(prof =>
        prof.profile?.homeDelivery === filters.homeService
      );
    }

    // Filtro por distancia
    if (filters.distance !== null) {
      filtered = filtered.filter(prof => {
        // Implementar cálculo de distancia si es necesario
        return true;
      });
    }

    // Filtro por rating mínimo
    if (filters.rating !== null) {
      // filtered = filtered.filter(prof => (prof.rating || 0) >= filters.rating!);
    }

    // Filtro por cashback mínimo
    if (filters.minCashback !== null) {
      filtered = filtered.filter(prof => {
        const cashback = prof.profile?.cashBackPercentage || 0;
        return cashback >= filters.minCashback!;
      });
    }

    // Filtro por disponibilidad
    if (filters.availability === 'now') {
      filtered = filtered.filter(prof => this.isAvailableNow(prof));
    }

    // Ordenamiento
    if (filters.orderBy) {
      filtered = this.sortProfessionals(filtered, filters.orderBy);
    }

    return filtered;
  }

  private isAvailableNow(professional: Professional): boolean {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const seats = professional.profile?.seats || [];

    for (const seat of seats) {
      const schedules = seat.schedule || [];

      for (const schedule of schedules) {
        if (schedule.isOpen) {
          const scheduleRanges = schedule.schedule || [];

          for (const range of scheduleRanges) {
            const [startHour, startMin] = (range.start || '00:00').split(':').map(Number);
            const [endHour, endMin] = (range.end || '23:59').split(':').map(Number);

            const startTime = startHour * 60 + startMin;
            const endTime = endHour * 60 + endMin;

            if (currentTime >= startTime && currentTime <= endTime) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  private sortProfessionals(professionals: Professional[], orderBy: 'cashback' | 'distance' | 'rating'): Professional[] {
    const sorted = [...professionals];

    switch (orderBy) {
      case 'cashback':
        return sorted.sort((a, b) =>
          (b.profile?.cashBackPercentage || 0) - (a.profile?.cashBackPercentage || 0)
        );

      case 'rating':
        return sorted;

      case 'distance':
        return sorted;

      default:
        return sorted;
    }
  }

  private resetAndLoad() {
    this.currentPage = 1;
    this.professionals = [];
    this.filteredProfessionals = [];
    this.hasMoreData = true;

    if (this.infiniteScroll) {
      this.infiniteScroll.disabled = false;
    }

    this.loadProfessionals(1, true);
  }

  async onSearchConfirm(query: string) {
    this.currentSearchQuery = query;
    const modal = await this.modalCtrl.create({
      component: ProfessionalsWantedComponent,
      componentProps: {
        currentSearchQuery: this.currentSearchQuery
      }
    });
    await modal.present();
  }

  async onFilterClick() {
    const modal = await this.modalCtrl.create({
      component: FilterByComponent,
      componentProps: {
        currentFilters: this.appliedFilters
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'apply' && data) {
      this.appliedFilters = data;
      this.resetAndLoad();
    } else if (role === 'clear') {
      this.appliedFilters = null;
      this.resetAndLoad();
    }
  }

  onIonInfinite(event: any) {
    if (!this.hasMoreData || this.isLoading) {
      event.target.complete();
      return;
    }

    const nextPage = this.currentPage + 1;

    this.loadProfessionals(nextPage, false);

    setTimeout(() => {
      event.target.complete();

      if (!this.hasMoreData) {
        event.target.disabled = true;
      }
    }, 500);
  }

  trackByProfessional(index: number, professional: Professional): string {
    return professional.id || index.toString();
  }
}
