import { CommonModule }                                      from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { IonIcon, IonText }                                  from "@ionic/angular/standalone";
import { FormattNumberPipe }                                 from 'src/app/shared/pipes';

@Component({
  selector: 'app-product-tag-create',
  templateUrl: './product-tag-create.component.html',
  styleUrls: ['./product-tag-create.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      IonIcon,
      IonText,
      FormattNumberPipe
    ]
})
export class ProductTagCreateComponent implements OnDestroy {
  @Output() selectProductTag: EventEmitter<any> = new EventEmitter<any>();
  @Output() delete: EventEmitter<any> = new EventEmitter<any>();
  @Input() product: any;
  @Input() productSelected: boolean = false;

  @Input() productVerified: boolean = false;

  constructor() { }
  ngOnDestroy(): void {
  }

  selectProduct() {
    this.selectProductTag.emit(this.product)
  }

  deleteProduct() {
    this.delete.emit(this.product)
  }

}

