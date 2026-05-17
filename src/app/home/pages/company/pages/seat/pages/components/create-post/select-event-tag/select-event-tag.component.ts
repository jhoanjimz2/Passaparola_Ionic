import { CommonModule }             from '@angular/common';
import { Component }                from '@angular/core';
import { IonContent }               from '@ionic/angular/standalone';
import { EventsService }            from 'src/app/shared/services';
import { Observable, Subscription } from 'rxjs';
import { CategoryEvent, Events }    from 'src/app/shared/interfaces/events/events';
import { FormsModule }              from '@angular/forms';
import { ModalController }          from '@ionic/angular';
import { EventTagComponent }        from 'src/app/home/pages/company/pages/seat/pages/components/tags/event-tag/event-tag.component';

@Component({
  selector: 'app-select-event-tag',
  templateUrl: './select-event-tag.component.html',
  styleUrls: ['./select-event-tag.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    EventTagComponent
  ]
})
export class SelectEventTagComponent {
  categories: CategoryEvent[] = [];
  events: Events[] = [];
  allEvents: Events[] = [];
  filteredEvents: Events[] = [];
  subscriptions: Subscription[] = [];

  selectedCategory: CategoryEvent | null = null;
  searchQuery: string = '';

  constructor(
    private eventsService: EventsService,
    private modalCtrl: ModalController
  ) {
    this.autoSubscribe(this.eventsService.obtenerAllCategoryFlatten(), v => this.categories = v);
    this.autoSubscribe(this.eventsService.obtenerAllEvents(), v => {
      console.log(v)
      this.allEvents = v;
      this.filteredEvents = [...v];
      this.events = [...v];
    });
  }

  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  // Corregido: Cambiar el tipo de parámetro de Event a Events
  selectEventTag(event: Events) {
    this.modalCtrl.dismiss({
      event
    })
  }

  onSearchChange(): void {
    this.filterEvents();
  }

  onCategorySelected(category: CategoryEvent): void {
    if (this.selectedCategory?.id === category.id) {
      this.selectedCategory = null;
    } else {
      this.selectedCategory = category;
    }
    this.filterEvents();
  }

  filterEvents(): void {
    let filtered = [...this.allEvents];

    // Filtrar por categoría - Los eventos tienen un array de categorías, no una sola
    if (this.selectedCategory) {
      filtered = filtered.filter(event =>
        event.categories?.some(cat => cat.id === this.selectedCategory?.id)
      );
    }

    // Filtrar por búsqueda
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(event => {
        // Buscar en nombre del evento
        const nameMatch = event.name?.toLowerCase().includes(query);

        // Buscar en descripción del evento
        const descriptionMatch = event.description?.toLowerCase().includes(query);

        // Buscar en categorías (los eventos tienen múltiples categorías)
        const categoryMatch = event.categories?.some(cat =>
          cat.description?.toLowerCase().includes(query) ||
          cat.eventCategoryTranslation?.description?.toLowerCase().includes(query)
        );

        // Buscar en dirección
        const addressMatch = event.address?.toLowerCase().includes(query);
        const webAddressMatch = event.webAddress?.toLowerCase().includes(query);

        // Buscar en status
        const processStatusMatch = event.processStatus?.toLowerCase().includes(query);
        const currencyStatusMatch = event.currencyStatus?.toLowerCase().includes(query);

        // Buscar en tags si existen
        const tagsMatch = event.tags?.some(tag =>
          tag.toLowerCase().includes(query)
        );

        return nameMatch || descriptionMatch || categoryMatch ||
               addressMatch || webAddressMatch || processStatusMatch ||
               currencyStatusMatch || tagsMatch;
      });
    }

    this.filteredEvents = filtered;
    this.events = filtered;
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = null;
    this.filteredEvents = [...this.allEvents];
    this.events = [...this.allEvents];
  }

  hasActiveFilters(): boolean {
    return (this.searchQuery && this.searchQuery.trim() !== '') || this.selectedCategory !== null;
  }

  getEventCountForCategory(categoryId: string): number {
    return this.allEvents.filter(event =>
      event.categories?.some(cat => cat.id === categoryId)
    ).length;
  }
}
