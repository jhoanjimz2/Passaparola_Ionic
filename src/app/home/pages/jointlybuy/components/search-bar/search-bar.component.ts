import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { IonIcon }                                                   from '@ionic/angular/standalone';
import { CommonModule }                                              from '@angular/common';
import { FormsModule }                                               from '@angular/forms';
import { Router }                                                    from '@angular/router';
import { Subject, Subscription, Observable }                         from 'rxjs';
import { debounceTime, distinctUntilChanged }                        from 'rxjs/operators';
import { Willbuy }                                                   from 'src/app/shared/interfaces/jointlybuy/willbuy';

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
  // Configuración de búsqueda
  @Input() placeholder: string = 'Cerca qui...';
  @Input() minSearchLength: number = 2;
  @Input() debounceTime: number = 400;
  @Input() categoryId?: string;

  // Función de búsqueda que el padre debe proveer
  @Input() searchFunction!: (params: any) => Observable<any>;

  // URL de navegación al seleccionar resultado
  @Input() detailRoute: string = '/pages/jointlybuy/view-willbuy';

  // Eventos para el componente padre
  @Output() searchStarted = new EventEmitter<string>();
  @Output() searchCompleted = new EventEmitter<Willbuy[]>();
  @Output() resultSelected = new EventEmitter<Willbuy>();

  searchTerm: string = '';
  searchResults: Willbuy[] = [];
  isSearching: boolean = false;
  showResults: boolean = false;

  private searchSubject = new Subject<string>();
  private subscriptions: Subscription[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (!this.searchFunction) {
      console.error('SearchBarComponent: searchFunction is required!');
      return;
    }

    const searchSub = this.searchSubject
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        if (searchTerm.trim().length >= this.minSearchLength) {
          this.performSearch(searchTerm);
        } else {
          this.clearResults();
        }
      });

    this.subscriptions.push(searchSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  onSearchClick(): void {
    if (this.searchTerm.trim().length >= this.minSearchLength) {
      this.performSearch(this.searchTerm);
    }
  }

  performSearch(keyword: string): void {
    this.isSearching = true;
    this.searchStarted.emit(keyword);

    const params = {
      limit: 10,
      offset: 1,
      keyword: keyword.trim(),
      ...(this.categoryId && { category: this.categoryId })
    };

    const searchSub = this.searchFunction(params).subscribe({
      next: (response) => {
        this.searchResults = response.data || response || [];
        this.showResults = true;
        this.isSearching = false;
        this.searchCompleted.emit(this.searchResults);
      },
      error: () => {
        this.searchResults = [];
        this.showResults = false;
        this.isSearching = false;
        this.searchCompleted.emit([]);
      }
    });

    this.subscriptions.push(searchSub);
  }

  selectResult(willbuy: Willbuy): void {
    this.resultSelected.emit(willbuy);
    this.router.navigate([this.detailRoute, willbuy.id]);
    this.clearResults();
    this.searchTerm = '';
  }

  getCurrentPhasePrice(willbuy: Willbuy): string {
    const currentPhase = this.getCurrentPhase(willbuy);
    const price = currentPhase?.total || 0;
    return `${(+price).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €/ATM`;
  }

  calculateCashback(willbuy: Willbuy): string {
    const currentPhase = this.getCurrentPhase(willbuy);
    const cashbackPercent = willbuy.product?.cashBack || 0;
    const price = +(currentPhase?.total || 0);
    const cashback = (cashbackPercent / 100) * price;
    return `${cashback.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
  }

  private getCurrentPhase(willbuy: Willbuy): any {
    if (!willbuy.purchaseDiscounts || willbuy.purchaseDiscounts.length === 0) {
      return null;
    }

    const sortedPhases = [...willbuy.purchaseDiscounts].sort((a, b) =>
      (a.quantity || 0) - (b.quantity || 0)
    );

    const soldUnits = this.getSoldUnits(willbuy);

    const currentPhase = sortedPhases.find(phase =>
      soldUnits < (phase.quantity || 0)
    );

    return currentPhase || sortedPhases[sortedPhases.length - 1];
  }

  private getSoldUnits(willbuy: Willbuy): number {
    if (!willbuy.willbuyTransactions || willbuy.willbuyTransactions.length === 0) {
      return 0;
    }

    return willbuy.willbuyTransactions.reduce((total, transaction) => {
      return total + (transaction.quantity || 0);
    }, 0);
  }

  clearResults(): void {
    this.searchResults = [];
    this.showResults = false;
    this.isSearching = false;
  }

  onBlur(): void {
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }

  onFocus(): void {
    if (this.searchResults.length > 0) {
      this.showResults = true;
    }
  }
}
