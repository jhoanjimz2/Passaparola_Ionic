import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-bank-card',
  templateUrl: './bank-card.component.html',
  styleUrls: ['./bank-card.component.scss'],
})
export class BankCardComponent implements OnInit {
  @Input() bankCard: any = {};

  @Output() delete = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  onDelete() {
    this.delete.emit(this.bankCard.customer);
  }
}
