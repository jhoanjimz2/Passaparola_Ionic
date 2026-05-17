import { Component, OnInit }   from '@angular/core';
import { CommonModule }        from '@angular/common';
import { ProfessionalFilters } from 'src/app/shared/interfaces/professionals/professionals';
import { ComponentModule }     from 'src/app/components/component.module';
import { ModalController }     from '@ionic/angular';

@Component({
  selector: 'app-filter-by',
  templateUrl: './filter-by.component.html',
  styleUrls: ['./filter-by.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ComponentModule
  ]
})
export class FilterByComponent implements OnInit {

  // Estado de los filtros
  filters: ProfessionalFilters = {
    homeService: null,
    orderBy: null,
    distance: null,
    rating: null,
    availability: null,
    minCashback: null
  };

  // Toggle del switch principal
  filtersEnabled: boolean = true;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  toggleFilters(): void {
    this.filtersEnabled = !this.filtersEnabled;
    if (!this.filtersEnabled) {
      this.resetFilters();
    }
  }

  // Servizio a domicilio
  selectHomeService(value: boolean): void {
    // Si se hace clic en el botón ya seleccionado, se deselecciona
    if (this.filters.homeService === value) {
      this.filters.homeService = null;
    } else {
      // Si se hace clic en el otro botón, se selecciona ese
      this.filters.homeService = value;
    }
  }

  // Ordina per
  selectOrderBy(value: 'cashback' | 'distance' | 'rating'): void {
    this.filters.orderBy = this.filters.orderBy === value ? null : value;
  }

  // Distanza da te
  selectDistance(value: number): void {
    this.filters.distance = this.filters.distance === value ? null : value;
  }

  // Valutazione
  selectRating(value: number | null): void {
    this.filters.rating = this.filters.rating === value ? null : value;
  }

  // Disponibilità
  selectAvailability(value: 'now' | 'always'): void {
    this.filters.availability = this.filters.availability === value ? null : value;
  }

  // Cashback minimo
  selectMinCashback(value: number): void {
    this.filters.minCashback = this.filters.minCashback === value ? null : value;
  }

  // Aplicar filtros y cerrar modal
  async onApplyFilters() {
    await this.modalController.dismiss(this.filters, 'apply');
  }

  // Resetear filtros
  resetFilters(): void {
    this.filters = {
      homeService: null,
      orderBy: null,
      distance: null,
      rating: null,
      availability: null,
      minCashback: null
    };
  }

  // Cancelar y cerrar modal
  async onAnnulla() {
    this.resetFilters();
    await this.modalController.dismiss(null, 'cancel');
  }

  // Helpers para verificar selección
  isHomeServiceSelected(value: boolean): boolean {
    return this.filters.homeService === value;
  }

  isOrderBySelected(value: string): boolean {
    return this.filters.orderBy === value;
  }

  isDistanceSelected(value: number): boolean {
    return this.filters.distance === value;
  }

  isRatingSelected(value: number | null): boolean {
    return this.filters.rating === value;
  }

  isAvailabilitySelected(value: string): boolean {
    return this.filters.availability === value;
  }

  isMinCashbackSelected(value: number): boolean {
    return this.filters.minCashback === value;
  }
}
