import { Component, EventEmitter, Output, OnDestroy } from '@angular/core';
import { IonIcon }                                       from '@ionic/angular/standalone';
import { FormsModule }                                   from '@angular/forms';
import { CommonModule }                                  from '@angular/common';
import { addIcons }                                      from 'ionicons';
import { searchOutline }                                 from 'ionicons/icons';
import { Subject, Subscription }                         from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SocialTagsService }                             from 'src/app/shared/services/social-tags.service';

interface SearchSuggestion {
  id: string;
  text: string;
}

@Component({
  selector: 'app-search-bar-social',
  templateUrl: './search-bar-social.component.html',
  styleUrls: ['./search-bar-social.component.scss'],
  standalone: true,
  imports: [FormsModule, IonIcon, CommonModule]
})
export class SearchBarSocialComponent implements OnDestroy {
  @Output() searchChange = new EventEmitter<string>();
  @Output() searchSubmit = new EventEmitter<string>();

  searchText: string = '';
  showSuggestions: boolean = false;
  suggestions: SearchSuggestion[] = [];
  isSearching: boolean = false;

  private searchSubject = new Subject<string>();
  private subscriptions: Subscription[] = [];

  constructor(private socialTagsService: SocialTagsService) {
    addIcons({ searchOutline });
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.searchSubject.complete();
  }

  private setupSearch(): void {
    const searchSub = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.trim().length < 2) {
          return new Promise<SearchSuggestion[]>(resolve => resolve([]));
        }

        this.isSearching = true;

        return this.socialTagsService.tags({
          limit: 10,
          offset: 1,
          languageCode: 'IT',
          keyword: term.trim()
        });
      })
    ).subscribe({
      next: (results: any[]) => {
        this.suggestions = results.map(item => ({
          id: item.id,
          text: item.description
        }));
        this.isSearching = false;
        this.showSuggestions = this.searchText.trim().length >= 2;
      },
      error: (error) => {
        console.error('Error searching tags:', error);
        this.isSearching = false;
        this.suggestions = [];
      }
    });

    this.subscriptions.push(searchSub);
  }

  onSearchInput(event: any) {
    this.searchText = event.target.value;
    this.searchChange.emit(this.searchText);

    if (this.searchText.trim().length >= 2) {
      this.searchSubject.next(this.searchText);
    } else {
      this.showSuggestions = false;
      this.suggestions = [];
      this.isSearching = false;
    }
  }

  onSearchSubmit() {
    if (this.searchText.trim()) {
      this.showSuggestions = false;
      this.searchSubmit.emit(this.searchText);
    }
  }

  selectSuggestion(suggestion: SearchSuggestion) {
    this.searchText = suggestion.text;
    this.showSuggestions = false;
    this.searchSubmit.emit(suggestion.text);
  }

  clearSearch() {
    this.searchText = '';
    this.showSuggestions = false;
    this.suggestions = [];
    this.isSearching = false;
    this.searchChange.emit(this.searchText);
  }

  onBlur() {
    // Ritardo per permettere il click sui suggerimenti
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  onFocus() {
    if (this.searchText.trim().length >= 2) {
      this.showSuggestions = true;
    }
  }
}
