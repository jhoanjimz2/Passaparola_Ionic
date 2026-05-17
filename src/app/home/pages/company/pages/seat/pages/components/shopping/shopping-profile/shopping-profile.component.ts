import { CommonModule }                                                                  from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { IonicModule }                                                                   from '@ionic/angular';
import { NgxMasonryComponent, NgxMasonryModule }                                         from 'ngx-masonry';
import { ProductSlideComponent }                                                         from '../product-slide/product-slide.component';
import { ProductGridComponent }                                                          from '../product-grid/product-grid.component';

@Component({
  selector: 'app-shopping-profile',
  templateUrl: './shopping-profile.component.html',
  styleUrls: ['./shopping-profile.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    NgxMasonryModule,
    ProductSlideComponent,
    ProductGridComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true
})
export class ShoppingProfileComponent implements OnChanges {
  @ViewChild('masonryProducts') masonryProducts!: NgxMasonryComponent;
  @Input() isPublic: boolean = false;
  @Input() tab!: string;

  masonryOptionsShopping = {
    itemSelector: '.masonry-item',
    columnWidth: '.grid-sizer',
    percentPosition: true,
    horizontalOrder: true
  };

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.tab === 'shopping') {
      setTimeout(() => {
        this.masonryProducts.layout();
      }, 100);
    }
  }

}
