import { CommonModule }                                          from '@angular/common';
import { Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import { ReactiveFormsModule }                                   from '@angular/forms';
import { Capacitor }                                             from '@capacitor/core';
import { Keyboard }                                              from '@capacitor/keyboard';
import { IonicModule, ModalController }                          from '@ionic/angular';
import { TranslateModule }                                       from '@ngx-translate/core';

@Component({
  selector: 'app-seat-category',
  templateUrl: './seat-category.component.html',
  styleUrls: ['./seat-category.component.scss'],
  standalone: true,
  imports: [TranslateModule, IonicModule, ReactiveFormsModule, CommonModule],
})
export class SeatCategoryComponent {
  @ViewChildren('tabButton') tabButtons!: QueryList<ElementRef<HTMLButtonElement>>;
  @Input() categoriesWithChildren: any = [];
  @Input() selectedCategories: any = [];
  categoriesWithChildrenAux: any = [];
  selectedCategoriesAux: any = [];
  selectedTabIndex: number | null = null;

  private showListener: any;
  private hideListener: any;
  keyboardIsOpen = false;

  flag: boolean = false;

  constructor(
    private modalController: ModalController
  ) {
    if (Capacitor.isNativePlatform()) {
      this.showListener = Keyboard.addListener('keyboardWillShow', () => {
        this.keyboardIsOpen = true;
      });

      this.hideListener = Keyboard.addListener('keyboardWillHide', () => {
        this.keyboardIsOpen = false;
      });
    }
  }

  async ngOnInit() {
  this.selectedCategoriesAux = Array.isArray(this.selectedCategories)
    ? [...this.selectedCategories]
    : [];

    if (this.selectedCategoriesAux.length > 0) {
      const firstSelected = this.selectedCategoriesAux[0];

      const foundIndex = this.categoriesWithChildren.findIndex((tab: any) => {
        if (tab.id === firstSelected.id) return true;
        if (tab.children) {
          return tab.children.some((child: any) => child.id === firstSelected.id);
        }
        return false;
      });

      if (foundIndex !== -1) {
        this.onSelectTab(foundIndex);
      }
    }

  }

  ngAfterViewInit() {
    if (this.selectedCategoriesAux.length > 0) {
      const firstSelected = this.selectedCategoriesAux[0];

      const foundIndex = this.categoriesWithChildren.findIndex((tab: any) => {
        if (tab.id === firstSelected.id) return true;
        if (tab.children) {
          return tab.children.some((child: any) => child.id === firstSelected.id);
        }
        return false;
      });

      if (foundIndex !== -1) {
        this.onSelectTab(foundIndex);
        setTimeout(() => {
          this.tabButtons.get(foundIndex)?.nativeElement.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
          });
        }, 200);
      }
    }
    this.flag = true;
  }

  ngOnDestroy() {
    this.showListener?.remove?.();
    this.hideListener?.remove?.();
  }

  onSelectTab(index: number) {
    this.selectedTabIndex = index;
    this.categoriesWithChildrenAux = this.categoriesWithChildren[index].children || [];

    if (this.flag) {
      this.selectedCategoriesAux = [];
    }

    if (!this.categoriesWithChildren[index].children.length) {
      if (!this.isCategorySelected(this.categoriesWithChildren[index])) {
        this.selectedCategoriesAux.push(this.categoriesWithChildren[index]);
      }
    } else {
      this.selectedCategoriesAux.push(this.categoriesWithChildren[index]);
    }
  }


  updateChecked(event: Event, category: any) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.isCategorySelected(category)) {
        this.selectedCategoriesAux.push(category);
      }
    } else {
      this.deleteSelectedCategory(category);
    }
  }

  deleteSelectedCategory(category: any) {
    this.selectedCategoriesAux = this.selectedCategoriesAux.filter(
      (c: any) => c.id !== category.id
    );
  }

  isCategorySelected(category: any): boolean {
    return this.selectedCategoriesAux.some((c: any) => c.id === category.id);
  }

  onCancel() {
    this.modalController.dismiss();
  }

  onSave() {
    const unique = this.selectedCategoriesAux.filter(
      (cat: any, index: any, self: any) =>
        index === self.findIndex((c:any) => c.id === cat.id)
    );
    this.modalController.dismiss({
      categories: unique
    });
  }

}
