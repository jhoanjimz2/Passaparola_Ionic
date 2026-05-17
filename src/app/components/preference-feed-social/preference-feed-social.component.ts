import { CommonModule }             from '@angular/common';
import { Component }                from '@angular/core';
import { FormsModule }              from '@angular/forms';
import { IonContent, IonIcon }      from '@ionic/angular/standalone';
import { Observable, Subscription } from 'rxjs';
import { PreferenceService }        from 'src/app/shared/services/preference.service';

enum Preference {
  official = 'official',
  byusers = 'byusers',
}

enum PreferenceLevel {
  like = 'mipiace',
  love = 'adoro',
  dislike = 'nograzie',
  none = 'none'
}

interface SavedPreference {
  id: string;
  type: string;
}

@Component({
  selector: 'app-preference-feed-social',
  templateUrl: './preference-feed-social.component.html',
  styleUrls: ['./preference-feed-social.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    FormsModule
  ]
})
export class PreferenceFeedSocialComponent  {

  preference = Preference;
  preferenceLevel = PreferenceLevel;
  typePreference: Preference = Preference.official;

  subscriptions: Subscription[] = [];

  // Array único de categorías con sus hijos
  categoriesWithChildren: any[] = [];

  // Almacenar preferencias de categorías oficiales
  officialPreferences: Map<string, PreferenceLevel> = new Map();

  // Almacenar preferencias de categorías de usuario
  userPreferences: Map<string, PreferenceLevel> = new Map();

  // Filtro de categoría padre seleccionada para "dagli utenti"
  selectedParentFilter: string = 'all';

  // Input para nueva categoría
  newCategoryInput: string = '';

  // Flag para evitar guardar durante la carga inicial
  private isLoadingInitialData: boolean = true;

  constructor(
    private preferenceService: PreferenceService
  ) {
    this.loadInitialData();
  }

  private loadInitialData() {
    // Cargar perfil del usuario para obtener preferencias guardadas
    this.preferenceService.getProfileById().subscribe((profile: any) => {
      const officialPrefs = profile.socialCommunityOficialPreferences || [];
      const userPrefs = profile.socialCommunityUserPreferences || [];

      // Cargar preferencias en los Maps
      officialPrefs.forEach((pref: SavedPreference) => {
        this.officialPreferences.set(pref.id, this.mapTypeToLevel(pref.type));
      });

      userPrefs.forEach((pref: SavedPreference) => {
        this.userPreferences.set(pref.id, this.mapTypeToLevel(pref.type));
      });
      this.isLoadingInitialData = false;
    });
    this.preferenceService.categoriesTagsWithChildren({limit: 1000000000, offset: 1});
    this.autoSubscribe(this.preferenceService.getCategoriesWithChildrenTags(), v => {
      this.categoriesWithChildren = v;
    });
  }
  private mapTypeToLevel(type: string): PreferenceLevel {
    switch(type) {
      case 'mipiace': return PreferenceLevel.like;
      case 'adoro': return PreferenceLevel.love;
      case 'nograzie': return PreferenceLevel.dislike;
      default: return PreferenceLevel.none;
    }
  }
  getOfficialCategories() {
    return this.categoriesWithChildren;
  }
  getUserCategories() {
    if (this.selectedParentFilter === 'all') {
      return this.categoriesWithChildren.flatMap(parent =>
        parent.children
          .filter((child: any) => child.fromApp === true)
          .map((child: any) => ({
            ...child,
            parentDescription: parent.description,
            parentId: parent.categoryId
          }))
      );
    } else {
      const parent = this.categoriesWithChildren.find(c => c.categoryId === this.selectedParentFilter);
      return parent
        ? parent.children
            .filter((child: any) => child.fromApp === true)
            .map((child: any) => ({
              ...child,
              parentDescription: parent.description,
              parentId: parent.categoryId
            }))
        : [];
    }
  }
  getFilterOptions() {
    return this.categoriesWithChildren;
  }

  getOfficialPreference(categoryId: string): PreferenceLevel {
    return this.officialPreferences.get(categoryId) || PreferenceLevel.none;
  }

  getUserPreference(childId: string): PreferenceLevel {
    return this.userPreferences.get(childId) || PreferenceLevel.none;
  }

  toggleOfficialPreference(categoryId: string, level: PreferenceLevel) {
    const current = this.getOfficialPreference(categoryId);

    if (current === level) {
      this.officialPreferences.delete(categoryId);
    } else {
      this.officialPreferences.set(categoryId, level);
    }

    if (!this.isLoadingInitialData) {
      this.savePreferences();
    }
  }

  toggleUserPreference(childId: string, level: PreferenceLevel) {
    const current = this.getUserPreference(childId);

    if (current === level) {
      this.userPreferences.delete(childId);
    } else {
      this.userPreferences.set(childId, level);
    }

    if (!this.isLoadingInitialData) {
      this.savePreferences();
    }
  }

  private savePreferences() {
    const payload = {
      socialCommunityOficialPreferences: Array.from(this.officialPreferences.entries()).map(([id, level]) => ({
        id,
        type: level
      })),
      socialCommunityUserPreferences: Array.from(this.userPreferences.entries()).map(([id, level]) => ({
        id,
        type: level
      }))
    };

    this.preferenceService.pushCategory(payload).subscribe();
  }

  // Verificar si un icono debe estar activo
  isOfficialIconActive(categoryId: string, level: PreferenceLevel): boolean {
    return this.getOfficialPreference(categoryId) === level;
  }

  // Verificar si un icono debe estar activo para usuario
  isUserIconActive(childId: string, level: PreferenceLevel): boolean {
    return this.getUserPreference(childId) === level;
  }

  // Obtener el nombre del icono según el nivel y si está activo
  getIconName(level: PreferenceLevel, isActive: boolean): string {
    const suffix = isActive ? '' : '-outline';

    switch(level) {
      case PreferenceLevel.like:
        return `thumbs-up${suffix}`;
      case PreferenceLevel.love:
        return `heart${suffix}`;
      case PreferenceLevel.dislike:
        return `thumbs-down${suffix}`;
      default:
        return '';
    }
  }

  // Cambiar filtro de categoría padre
  selectParentFilter(parentId: string) {
    this.selectedParentFilter = parentId;
  }

  // Verificar si se puede agregar una categoría
  canAddCategory(): boolean {
    return this.selectedParentFilter !== 'all' && this.newCategoryInput.trim() !== '';
  }

  // Agregar nueva categoría
  addNewCategory() {
    if (this.canAddCategory()) {
      const createCategoryData = {
        description: this.newCategoryInput.trim(),
        parentId: this.selectedParentFilter,
        fromApp: true,
        categoryTranslations: [
          {
            description:  this.newCategoryInput.trim(),
            languageCode: "IT"
          }
        ],

      };

      this.preferenceService.createCategory(createCategoryData).subscribe({
        next: (response) => {
          console.log('Categoría creada exitosamente:', response);
          this.preferenceService.categoriesTagsWithChildren({limit: 1000000000, offset: 1});
          this.newCategoryInput = '';
        },
        error: (error) => {
          console.error('Error al crear categoría:', error);
        }
      });
    }
  }

  // Obtener el mensaje del placeholder según el estado
  getPlaceholderMessage(): string {
    if (this.selectedParentFilter === 'all') {
      return 'Seleziona prima una categoria';
    }
    return 'scrivi qui un nuovo argomento';
  }

  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
}
