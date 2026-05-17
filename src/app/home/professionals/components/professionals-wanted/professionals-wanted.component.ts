import { CommonModule }                                            from '@angular/common';
import { Component, Input, OnInit, OnDestroy }                     from '@angular/core';
import { IonContent }                                              from "@ionic/angular/standalone";
import { Professional, ProfessionalCategory, ProfessionalFilters } from 'src/app/shared/interfaces/professionals/professionals';
import { ModalController }                                         from '@ionic/angular';
import { ProfessionalCardComponent }                               from '../professional-card/professional-card.component';
import { SearchBarComponent }                                      from '../search-bar/search-bar.component';
import { FilterByComponent }                                       from '../filter-by/filter-by.component';
import { ComponentModule }                                         from 'src/app/components/component.module';
import { getCategoryName }                                         from 'src/app/shared/interfaces/professionals/professionals';
import { ProfessionalsService, Params }                            from 'src/app/shared/services/professionals.service';
import { Subject, takeUntil }                                      from 'rxjs';

@Component({
  selector: 'app-professionals-wanted',
  templateUrl: './professionals-wanted.component.html',
  styleUrls: ['./professionals-wanted.component.scss'],
  standalone: true,
  imports:[
    IonContent,
    CommonModule,
    SearchBarComponent,
    ProfessionalCardComponent,
    ComponentModule
  ]
})
export class ProfessionalsWantedComponent implements OnInit, OnDestroy {
  @Input() category: ProfessionalCategory = {} as ProfessionalCategory;
  @Input() currentSearchQuery: string = '';

  professionals: Professional[] = [];
  allProfessionals: Professional[] = [];
  appliedFilters: ProfessionalFilters | null = null;

  private destroy$ = new Subject<void>();
  private currentParams: Params = {
    limit: 20,
    offset: 1,
    languageCode: 'IT'
  };

  constructor(
    private modalController: ModalController,
    private professionalsService: ProfessionalsService
  ) {}

  ngOnInit(): void {
    this.subscribeToWantedProfessionals();
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Suscribirse a los cambios de profesionales wanted
   */
  private subscribeToWantedProfessionals(): void {
    this.professionalsService.allProfessionalsWanted()
      .pipe(takeUntil(this.destroy$))
      .subscribe((professionals: Professional[]) => {
        this.allProfessionals = professionals;
        this.applyFiltersAndSearch();
      });
  }

  /**
   * Cargar datos iniciales
   */
  private loadInitialData(): void {
    const params: Params = {
      ...this.currentParams,
      categoryId: this.category?.id || undefined
    };

    this.professionalsService.loadProfessionalsWanted(params)
      .subscribe({
        next: () => console.log('Profesionales wanted cargados'),
        error: (error) => console.error('Error cargando profesionales wanted:', error)
      });
  }

  /**
   * Aplica filtros y búsqueda sobre los profesionales
   */
  private applyFiltersAndSearch(): void {
    let filtered = [...this.allProfessionals];

    // 1. Filtrar por búsqueda
    if (this.currentSearchQuery.trim()) {
      const query = this.currentSearchQuery.toLowerCase().trim();
      filtered = filtered.filter(prof => {
        // Buscar en el nombre de la compañía (profile.name)
        const companyName = prof.profile?.name?.toLowerCase() || '';

        // Buscar en las categorías de los seats
        const categoryMatch = prof.profile?.seats?.some(seat =>
          seat.categories?.some(cat =>
            cat.description?.toLowerCase().includes(query) ||
            cat.companyCategoryTranslation?.description?.toLowerCase().includes(query)
          )
        );

        // Buscar en el nombre de los seats
        const seatMatch = prof.profile?.seats?.some(seat =>
          seat.name?.toLowerCase().includes(query) ||
          seat.description?.toLowerCase().includes(query)
        );

        return companyName.includes(query) || categoryMatch || seatMatch;
      });
    }

    // 2. Aplicar filtros si están activos
    if (this.appliedFilters) {
      // Filtro: Servizio a domicilio (homeDelivery)
      if (this.appliedFilters.homeService !== null) {
        filtered = filtered.filter(prof =>
          prof.profile?.homeDelivery === this.appliedFilters!.homeService
        );
      }

      // Filtro: Distancia (rangeService)
      if (this.appliedFilters.distance !== null) {
        filtered = filtered.filter(prof => {
          const rangeService = prof.profile?.rangeService || 0;
          return rangeService <= this.appliedFilters!.distance!;
        });
      }

      // Filtro: Valutazione
      if (this.appliedFilters.rating !== null) {
        // TODO: Implementar cuando el backend soporte rating
        console.warn('Rating filter not supported yet');
      }

      // Ordenar según el criterio seleccionado
      if (this.appliedFilters.orderBy) {
        filtered = this.sortProfessionals(filtered, this.appliedFilters.orderBy);
      }
    }

    this.professionals = filtered;
  }

  /**
   * Ordena los profesionales según el criterio
   */
  private sortProfessionals(
    professionals: Professional[],
    orderBy: 'cashback' | 'distance' | 'rating'
  ): Professional[] {
    return [...professionals].sort((a, b) => {
      switch (orderBy) {
        case 'rating':
          // TODO: Implementar cuando exista rating en la interfaz
          return 0;
        case 'cashback':
          const cashbackA = a.profile?.cashBackPercentage || 0;
          const cashbackB = b.profile?.cashBackPercentage || 0;
          return cashbackB - cashbackA;
        case 'distance':
          const distanceA = a.profile?.rangeService || 0;
          const distanceB = b.profile?.rangeService || 0;
          return distanceA - distanceB;
        default:
          return 0;
      }
    });
  }

  getSearchMode(): 'category' | 'search' | 'both' | 'none' {
    const hasCategory = this.category && this.category.id;
    const hasSearch = this.currentSearchQuery.trim().length > 0;

    if (hasCategory && hasSearch) return 'both';
    if (hasCategory) return 'category';
    if (hasSearch) return 'search';
    return 'none';
  }

  getCategoryDisplayName(): string {
    return getCategoryName(this.category, 'IT');
  }

  onSearchChange(query: string): void {
    this.currentSearchQuery = query;
    this.applyFiltersAndSearch();
  }

  async onFilterClick() {
    const modal = await this.modalController.create({
      component: FilterByComponent,
      componentProps: {
        isWantedMode: true
      }
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'apply' && data) {
      console.log('Filtros aplicados:', data);
      this.appliedFilters = data;
      this.applyFiltersAndSearch();
    } else if (role === 'cancel') {
      console.log('Filtros cancelados');
      this.appliedFilters = null;
      this.applyFiltersAndSearch();
    }
  }
}
