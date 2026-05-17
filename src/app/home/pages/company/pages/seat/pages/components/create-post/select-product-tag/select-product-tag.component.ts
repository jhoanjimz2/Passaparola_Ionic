import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IonContent }                          from "@ionic/angular/standalone";
import { CommonModule }                        from '@angular/common';
import { FormsModule }                         from '@angular/forms';
import { Observable, Subscription }            from 'rxjs';
import { ProductTagCreateComponent }           from "src/app/home/pages/company/pages/seat/pages/components/tags/product-tag-create/product-tag-create.component";
import { ProductTagsService }                  from 'src/app/shared/services/product-tags.service';
import { ModalController }                     from '@ionic/angular';

@Component({
  selector: 'app-select-product-tag',
  templateUrl: './select-product-tag.component.html',
  styleUrls: ['./select-product-tag.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    ProductTagCreateComponent
  ]
})
export class SelectProductTagComponent implements OnInit, OnDestroy {
  @Input() typeProduct: 'all' | 'my' = 'all';
  @Input() multiSelect: boolean = false; // Permitir selección múltiple
  @Input() productsSelectedPrev: any[] = []; // Productos previamente seleccionados

  categories: any[] = [];
  products: any[] = [];
  allProducts: any[] = [];
  filteredProducts: any[] = [];
  subscriptions: Subscription[] = [];
  selectedProducts: any[] = []; // Array de productos seleccionados

  selectedCategory: any | null = null;
  searchQuery: string = '';

  constructor(
    private productTagsService: ProductTagsService,
    private modalCtrl: ModalController
  ) {
    this.autoSubscribe(this.productTagsService.getAllCategories(), v => this.categories = v);
    this.autoSubscribe(this.productTagsService.getAllProducts(), v => {
      this.allProducts = v;
      this.filteredProducts = [...v];
      this.products = [...v];
    });
  }

  ngOnInit(): void {
    // Cargar productos previamente seleccionados
    if (this.productsSelectedPrev && this.productsSelectedPrev.length > 0) {
      this.selectedProducts = [...this.productsSelectedPrev];
    }
  }

  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  selectProductTag(product: any) {
    if (this.multiSelect) {
      this.toggleProductSelection(product);
    } else {
      // Selección única - cierra el modal inmediatamente
      this.modalCtrl.dismiss({
        product
      });
    }
  }

  toggleProductSelection(product: any): void {
    const index = this.selectedProducts.findIndex(p => p.id === product.id);
    if (index > -1) {
      // Ya está seleccionado, lo quitamos
      this.selectedProducts.splice(index, 1);
    } else {
      // No está seleccionado, lo agregamos
      this.selectedProducts.push(product);
    }
  }

  isProductSelected(product: any): boolean {
    return this.selectedProducts.some(p => p.id === product.id);
  }

  confirmSelection(): void {
    this.modalCtrl.dismiss({
      products: this.selectedProducts
    });
  }

  cancelSelection(): void {
    this.modalCtrl.dismiss();
  }

  onSearchChange(): void {
    this.filterProducts();
  }

  onCategorySelected(category: any): void {
    if (this.selectedCategory?.id === category.id) {
      this.selectedCategory = null;
    } else {
      this.selectedCategory = category;
    }
    this.filterProducts();
  }

  filterProducts(): void {
    let filtered = [...this.allProducts];

    // Filtro por categoría
    if (this.selectedCategory) {
      filtered = filtered.filter(product =>
        product.category?.id === this.selectedCategory?.id
      );
    }

    // Filtro por búsqueda
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => {
        const nameMatch = product.name && typeof product.name === 'string' ?
          product.name.toLowerCase().includes(query) : false;
        const descriptionMatch = product.description && typeof product.description === 'string' ?
          product.description.toLowerCase().includes(query) : false;
        const longDescriptionMatch = product.longDescription && typeof product.longDescription === 'string' ?
          product.longDescription.toLowerCase().includes(query) : false;
        const categoryDescMatch = product.category?.description && typeof product.category.description === 'string' ?
          product.category.description.toLowerCase().includes(query) : false;
        const categoryTranslationMatch = product.category?.productCategoryTranslation?.some(
          (translation: any) => translation.description && typeof translation.description === 'string' &&
                        translation.description.toLowerCase().includes(query)
        ) || product.category?.categoryTranslations?.some(
          (translation: any) => translation.description && typeof translation.description === 'string' &&
                        translation.description.toLowerCase().includes(query)
        );
        const brandMatch = (product.brand?.name && typeof product.brand.name === 'string' &&
                           product.brand.name.toLowerCase().includes(query)) ||
                          (product.brand?.description && typeof product.brand.description === 'string' &&
                           product.brand.description.toLowerCase().includes(query));
        const shippingAgentMatch = (product.shippingAgent?.name && typeof product.shippingAgent.name === 'string' &&
                                   product.shippingAgent.name.toLowerCase().includes(query)) ||
                                  (product.shippingAgent?.description && typeof product.shippingAgent.description === 'string' &&
                                   product.shippingAgent.description.toLowerCase().includes(query));
        const tagsMatch = product.tags && typeof product.tags === 'string' ?
          product.tags.toLowerCase().includes(query) : false;
        const codeCountryMatch = product.codeCountry && typeof product.codeCountry === 'string' ?
          product.codeCountry.toLowerCase().includes(query) : false;

        return nameMatch || descriptionMatch || longDescriptionMatch || categoryDescMatch ||
               categoryTranslationMatch || brandMatch || shippingAgentMatch || tagsMatch || codeCountryMatch;
      });
    }

    this.filteredProducts = filtered;
    this.products = filtered;
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = null;
    this.filteredProducts = [...this.allProducts];
    this.products = [...this.allProducts];
  }

  hasActiveFilters(): boolean {
    return (this.searchQuery && this.searchQuery.trim() !== '') || this.selectedCategory !== null;
  }

  getProductCountForCategory(categoryId: string): number {
    return this.allProducts.filter(product => product.category?.id === categoryId).length;
  }
}
