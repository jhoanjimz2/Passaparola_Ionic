import { Component, EventEmitter, Output, Input, OnInit, OnDestroy } from '@angular/core';
import { IonIcon }                                                   from '@ionic/angular/standalone';
import { CommonModule }                                              from '@angular/common';
import { FormsModule }                                               from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged }    from 'rxjs';
import { ProfessionalsService }                                      from 'src/app/shared/services/professionals.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    CommonModule,
    FormsModule
  ]
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() placeholder: string = 'Buscar...';
  @Input() languageCode: string = 'IT';
  @Output() searchChange = new EventEmitter<string>();
  @Output() searchConfirm = new EventEmitter<string>();
  @Output() filterClick = new EventEmitter<void>();

  searchQuery: string = '';
  showSuggestions: boolean = false;
  filteredSuggestions: string[] = [];
  isLoading: boolean = false;

  private searchSubject$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private professionalsService: ProfessionalsService
  ) {}

  ngOnInit(): void {
    // Configurar debounce para las búsquedas
    this.searchSubject$
      .pipe(
        debounceTime(300), // Espera 300ms después de que el usuario deje de escribir
        distinctUntilChanged(), // Solo emite si el valor cambió
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        if (searchTerm.trim().length > 0) {
          this.loadSuggestions(searchTerm);
        } else {
          this.filteredSuggestions = [];
          this.showSuggestions = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSuggestions(keyword: string): void {
    this.isLoading = true;

    const params = {
      limit: 5,
      offset: 1,
      keyword: keyword,
      languageCode: this.languageCode
    };

    this.professionalsService.findAllSuggestions(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;

          if (response?.data && Array.isArray(response.data)) {
            // Extraer las descripciones de las traducciones según el languageCode
            this.filteredSuggestions = response.data
              .map((item: any) => {
                // Buscar la traducción que coincida con el languageCode
                const translation = item.categoryTranslations?.find(
                  (trans: any) => trans.languageCode === this.languageCode
                );

                // Si existe traducción, usar su descripción, sino usar la descripción por defecto
                return translation?.description || item.description;
              })
              .filter((desc: string) => desc && desc.trim().length > 0); // Filtrar valores vacíos
          } else {
            this.filteredSuggestions = [];
          }

          this.showSuggestions = this.filteredSuggestions.length > 0;
        },
        error: (error) => {
          console.error('Error al cargar sugerencias:', error);
          this.isLoading = false;
          this.filteredSuggestions = [];
          this.showSuggestions = false;
        }
      });
  }

  onSearchInput(event: any): void {
    this.searchQuery = event.target.value;
    this.searchChange.emit(this.searchQuery);

    // Enviar el término de búsqueda al subject para que se procese con debounce
    this.searchSubject$.next(this.searchQuery);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.searchQuery.trim().length > 0) {
      this.confirmSearch();
    }
  }

  onSuggestionClick(suggestion: string): void {
    this.searchQuery = suggestion;
    this.showSuggestions = false;
    this.confirmSearch();
  }

  private confirmSearch(): void {
    this.searchConfirm.emit(this.searchQuery);
  }

  onFilterClick(): void {
    this.filterClick.emit();
  }

  onFocus(): void {
    if (this.searchQuery.trim().length > 0 && this.filteredSuggestions.length > 0) {
      this.showSuggestions = true;
    }
  }

  onBlur(): void {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }
}
