import { Component, Input, OnDestroy } from '@angular/core';
import { ModalController }             from '@ionic/angular';
import { Subscription }                from 'rxjs';
import { CategoryEvent }               from 'src/app/shared/interfaces/events/events';
import { EventsService }               from 'src/app/shared/services';


interface FlatCategory {
  id: string;
  name: string;
  selected: boolean;
}

interface CategoryGroup {
  parent: CategoryEvent;
  items: FlatCategory[];
  title?: string;
}


@Component({
  selector: 'app-filter-category',
  templateUrl: './filter-category.component.html',
  styleUrls: ['./filter-category.component.scss']
})
export class FilterCategoryComponent implements OnDestroy {
  @Input() categorySelect!: CategoryEvent;
  @Input() selectIdsCategories: string[] = [];

  categoryGroups: CategoryGroup[] = [];

  paymentOptions = [
    { id: 'gratis', name: 'Gratuiti' },
    { id: 'pagamento', name: 'A pagamento' },
  ];

  selectedPayment = 'gratis';
  subscription!: Subscription;



  constructor(
    private modalController: ModalController,
    private eventsService: EventsService
  ) {}


  ngOnInit() {
    this.subscription = this.eventsService.obtenerAllCategorys().subscribe({
      next: (allCategories) => {
        const clonedCategories = structuredClone(allCategories);

        if (this.categorySelect?.id) {
          const selectedCategory = this.findCategoryById(clonedCategories, this.categorySelect.id);

          if (selectedCategory && selectedCategory.children?.length) {
            this.categoryGroups = [{
              parent: selectedCategory,
              title: selectedCategory.eventCategoryTranslation?.description || selectedCategory.description,
              items: this.flattenOnlyChildren(selectedCategory.children)
            }];
          } else {
            this.categoryGroups = [];
          }

        } else {
          this.categoryGroups = clonedCategories.map((category: CategoryEvent) => ({
            parent: category,
            title: category.eventCategoryTranslation?.description || category.description,
            items: this.flattenOnlyChildren(category.children || [])
          })).filter((group: CategoryGroup) => group.items.length > 0);

        }
      }
    });
  }



  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
  selectPayment(paymentId: string) {
    this.selectedPayment = paymentId;
  }

  onCancel() {
    this.modalController.dismiss();
  }

  toggleCategory(category: FlatCategory) {
    category.selected = !category.selected;
  }

  filtrar() {

    const selectedCategories = this.categoryGroups
      .reduce((acc, group) => acc.concat(group.items), [] as FlatCategory[])
      .filter(cat => cat.selected)
      .map(cat => cat.id);

    this.modalController.dismiss({
      selectedCategories,
      selectedPayment: this.selectedPayment,
    });
  }


  findCategoryById(categories: CategoryEvent[], id: string): CategoryEvent | null {
    for (const category of categories) {
      if (category.id === id) return category;

      if (Array.isArray(category.children) && category.children.length > 0) {
        const found = this.findCategoryById(category.children, id);
        if (found) return found;
      }
    }

    return null;
  }

  flattenOnlyChildren(categories: CategoryEvent[], seen = new Set()): { id: string, name: string, selected: boolean }[] {
    let result: { id: string, name: string, selected: boolean }[] = [];

    for (const category of categories) {
      if (!category || seen.has(category.id)) continue;
      seen.add(category.id);

      if (Array.isArray(category.children) && category.children.length > 0) {
        // Recurse into children
        result.push(...this.flattenOnlyChildren(category.children, seen));
      } else {
        // Add leaf node
        result.push({
          id: category.id,
          name: category.eventCategoryTranslation?.description || category.description,
          selected: this.selectIdsCategories.includes(category.id),
        });
      }
    }

    return result;
  }
}
