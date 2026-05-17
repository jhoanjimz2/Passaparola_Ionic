import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FilterCategoryComponent } from '../../modals/filter-category/filter-category.component';
import { CategoryEvent } from 'src/app/shared/interfaces/events/events';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  @Input() categorySelect!: CategoryEvent;
  @Input() selectIdsCategories: string[] = [];
  @Output() selectCategories: EventEmitter<string[]> = new EventEmitter<
    string[]
  >();
  searchText: string = '';

  constructor(private modalController: ModalController) {}

  onSearch() {
    console.info('Buscando:', this.searchText);
  }

  async selectCategory() {
    const modal = await this.modalController.create({
      component: FilterCategoryComponent,
      componentProps: {
        selectIdsCategories: this.selectIdsCategories,
        categorySelect: this.categorySelect,
      },
      cssClass: ['radius-modals', 'modal-95vh'],
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.selectCategories.emit(data);
    }
  }
}
