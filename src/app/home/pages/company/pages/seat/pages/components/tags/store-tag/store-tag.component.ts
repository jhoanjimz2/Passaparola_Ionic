import { CommonModule }                                      from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { IonIcon }                                           from '@ionic/angular/standalone';

@Component({
  selector: 'app-store-tag',
  templateUrl: './store-tag.component.html',
  styleUrls: ['./store-tag.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    CommonModule
  ]
})
export class StoreTagComponent implements OnDestroy {
  @Output() selectStoreTag: EventEmitter<any> = new EventEmitter();
  @Output() goStore: EventEmitter<any> = new EventEmitter();
  @Output() modify: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<any> = new EventEmitter();
  @Input() storeSelect: boolean = false;
  @Input() storeTagProfile: boolean = false;
  @Input() storeTag: boolean = false;
  @Input() store: any;
  @Input() showDetail: boolean = false;

  constructor() { }

  ngOnDestroy(): void {}

  deselect() {
    this.selectStoreTag.emit();
  }

  selected() {
    this.select.emit()
  }

  viewStore() {
    this.goStore.emit()
  }

  modifyDelete() {
    this.modify.emit()
  }

}
