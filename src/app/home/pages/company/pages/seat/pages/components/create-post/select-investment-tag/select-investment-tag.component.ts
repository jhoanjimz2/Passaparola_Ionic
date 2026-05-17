import { Component }                from '@angular/core';
import { IonContent }               from '@ionic/angular/standalone';
import { Observable, Subscription } from 'rxjs';
import { ProjectsService }          from 'src/app/shared/services/projects.service';
import { CategoryProject }          from 'src/app/shared/interfaces/projects/categories';
import { CommonModule }             from '@angular/common';
import { FormsModule }              from '@angular/forms';
import { Project }                  from 'src/app/shared/interfaces/projects/project';
import { InvestmentTagComponent }   from 'src/app/home/pages/company/pages/seat/pages/components/tags/investment-tag/investment-tag.component';
import { ModalController }          from '@ionic/angular';

@Component({
  selector: 'app-select-investment-tag',
  templateUrl: './select-investment-tag.component.html',
  styleUrls: ['./select-investment-tag.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    InvestmentTagComponent
  ]
})
export class SelectInvestmentTagComponent {
  categories: CategoryProject[] = [];
  projects: Project[] = [];
  allProjects: Project[] = [];
  filteredProjects: Project[] = [];
  subscriptions: Subscription[] = [];

  selectedCategory: CategoryProject | null = null;
  searchQuery: string = '';

  constructor(
    private projectsService: ProjectsService,
    private modalCtrl: ModalController
  ) {
    this.autoSubscribe(this.projectsService.getAllCategories(), v => this.categories = v);
    this.autoSubscribe(this.projectsService.getAllProjects(), v => {
      this.allProjects = v;
      this.filteredProjects = [...v];
      this.projects = [...v];
    });
  }

  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  selectProjectTag(project: Project) {
    this.modalCtrl.dismiss({
      project
    })
  }

  onSearchChange(): void {
    this.filterProjects();
  }

  onCategorySelected(category: CategoryProject): void {
    if (this.selectedCategory?.id === category.id) {
      this.selectedCategory = null;
    } else {
      this.selectedCategory = category;
    }
    this.filterProjects();
  }

  filterProjects(): void {
    let filtered = [...this.allProjects];

    if (this.selectedCategory) {
      filtered = filtered.filter(project =>
        project.category?.id === this.selectedCategory?.id
      );
    }

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(project => {
        const nameMatch = project.name?.toLowerCase().includes(query);
        const categoryMatch = project.category?.name?.toLowerCase().includes(query);
        const categoryTranslationMatch = project.category?.projectCategoryTranslation?.some(
          translation => translation.description?.toLowerCase().includes(query)
        ) || project.category?.categoryTranslation?.some(
          translation => translation.description?.toLowerCase().includes(query)
        );
        const typeMatch = project.type?.toLowerCase().includes(query);
        const statusMatch = project.status?.toLowerCase().includes(query);
        return nameMatch || categoryMatch || categoryTranslationMatch || typeMatch || statusMatch;
      });
    }

    this.filteredProjects = filtered;
    this.projects = filtered;
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = null;
    this.filteredProjects = [...this.allProjects];
    this.projects = [...this.allProjects];
  }
  hasActiveFilters(): boolean {
    return (this.searchQuery && this.searchQuery.trim() !== '') || this.selectedCategory !== null;
  }
  getProjectCountForCategory(categoryId: string): number {
    return this.allProjects.filter(project => project.category?.id === categoryId).length;
  }
}
