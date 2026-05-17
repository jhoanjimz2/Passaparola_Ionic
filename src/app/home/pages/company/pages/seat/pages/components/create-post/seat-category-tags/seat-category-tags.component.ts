import { CommonModule }                                       from '@angular/common';
import { Component, OnDestroy, OnInit, Input }                from '@angular/core';
import { FormsModule }                                        from '@angular/forms';
import { ModalController }                                    from '@ionic/angular';
import { Observable, Subject, Subscription }                  from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { SocialTagsService }                                  from 'src/app/shared/services/social-tags.service';

interface CategoryTag {
  description: string;
  categoryId: string;
  topics: string[];
}

interface TopicSearchResult {
  id: string;
  name: string;
}

@Component({
  selector: 'app-seat-category-tags',
  templateUrl: './seat-category-tags.component.html',
  styleUrls: ['./seat-category-tags.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SeatCategoryTagsComponent implements OnInit, OnDestroy {
  @Input() initialData: CategoryTag[] = [];

  subscriptions: Subscription[] = [];
  categories: CategoryTag[] = [];
  filteredCategories: CategoryTag[] = [];
  selectedCategoryId: string | null = null;

  categorySearchTerm: string = '';
  topicSearchTerm: string = '';
  topicSearchResults: TopicSearchResult[] = [];
  showTopicDropdown: boolean = false;
  isSearchingTopics: boolean = false;

  private topicSearchSubject = new Subject<string>();

  constructor(
    private socialTagsService: SocialTagsService,
    private modalController: ModalController
  ) {
    this.setupTopicSearch();
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  get categorySelect(): CategoryTag | null {
    if (!this.selectedCategoryId) return null;
    return this.categories.find(c => c.categoryId === this.selectedCategoryId) || null;
  }

  get totalTopicsCount(): number {
    return this.categories.reduce((total, category) => total + category.topics.length, 0);
  }

  private loadCategories(): void {
    this.autoSubscribe(
      this.socialTagsService.getCategoriesTags(),
      (v) => {
        // Crear una copia profunda del array de categorías
        this.categories = v.map(category => ({
          ...category,
          topics: [...category.topics]
        }));

        // Si hay datos iniciales, restaurar los topics seleccionados
        if (this.initialData && this.initialData.length > 0) {
          this.restoreInitialData();
        }

        this.filteredCategories = [...this.categories];
      }
    );
  }

  private restoreInitialData(): void {
    this.initialData.forEach(savedCategory => {
      const category = this.categories.find(c => c.categoryId === savedCategory.categoryId);
      if (category && savedCategory.topics && savedCategory.topics.length > 0) {
        category.topics = [...savedCategory.topics];
      }
    });
  }

  private setupTopicSearch(): void {
    this.autoSubscribe(
      this.topicSearchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => {
          if (term.trim().length < 2) {
            return new Observable<TopicSearchResult[]>(obs => {
              obs.next([]);
              obs.complete();
            });
          }
          this.isSearchingTopics = true;

          return this.socialTagsService.tags({
            limit: 1000000000,
            offset: 1,
            languageCode: 'IT',
            keyword: term.trim()
          }).pipe(
            map(results => results.map((item: any) => ({
              id: item.id,
              name: item.description
            })))
          );
        })
      ),
      (results) => {
        this.topicSearchResults = results;
        this.isSearchingTopics = false;
        this.showTopicDropdown = this.topicSearchTerm.trim().length >= 2;
      }
    );
  }

  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void): void {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.topicSearchSubject.complete();
  }

  onCategorySearchChange(): void {
    if (!this.categorySearchTerm.trim()) {
      this.filteredCategories = this.categories;
      return;
    }

    const term = this.categorySearchTerm.toLowerCase();
    this.filteredCategories = this.categories.filter(cat =>
      cat.description.toLowerCase().includes(term)
    );
  }

  selectCategory(category: CategoryTag): void {
    this.selectedCategoryId = category.categoryId;
    this.topicSearchTerm = '';
    this.topicSearchResults = [];
    this.showTopicDropdown = false;
  }

  onTopicSearchChange(): void {
    this.topicSearchSubject.next(this.topicSearchTerm);
  }

  selectTopicFromSearch(topic: TopicSearchResult): void {
    const category = this.categorySelect;
    if (!category) return;

    if (this.totalTopicsCount >= 5) {
      return;
    }

    if (!category.topics.includes(topic.name)) {
      category.topics.push(topic.name);
    }

    this.topicSearchTerm = '';
    this.topicSearchResults = [];
    this.showTopicDropdown = false;
  }

  addNewTopic(): void {
    const category = this.categorySelect;
    if (!category || !this.topicSearchTerm.trim()) return;

    const newTopicName = this.topicSearchTerm.trim();

    if (this.totalTopicsCount >= 5) {
      return;
    }

    if (category.topics.includes(newTopicName)) {
      return;
    }

    category.topics.push(newTopicName);

    this.topicSearchTerm = '';
    this.topicSearchResults = [];
    this.showTopicDropdown = false;
  }

  removeTopic(topic: string): void {
    const category = this.categorySelect;
    if (!category) return;

    const index = category.topics.indexOf(topic);
    if (index > -1) {
      category.topics.splice(index, 1);
    }
  }

  hideTopicDropdown(): void {
    setTimeout(() => {
      this.showTopicDropdown = false;
    }, 200);
  }

  async saveAndClose(): Promise<void> {
    const selectedCategories = this.categories
      .filter(category => category.topics && category.topics.length > 0)
      .map(category => ({
        categoryId: category.categoryId,
        description: category.description,
        topics: [...category.topics],
        languageCode: 'IT'
      }));

    await this.modalController.dismiss(selectedCategories, 'save');
  }

  async cancel(): Promise<void> {
    await this.modalController.dismiss(null, 'cancel');
  }
}
