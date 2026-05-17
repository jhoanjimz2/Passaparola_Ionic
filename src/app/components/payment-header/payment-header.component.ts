import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-payment-header',
  templateUrl: './payment-header.component.html',
  styleUrls: ['./payment-header.component.scss'],
})
export class PaymentHeaderComponent implements OnInit {
  @Input() buttonActive: string = 'leftButton';
  @Input() color: string = 'color1';
  @Input() decimalAmount: string = '00';
  @Input() mainAmount: string = '0';
  @Input() labelLeftButton: string = '';
  @Input() iconLeftButton: string = '';
  @Input() labelRightButton: string = '';
  @Input() iconRightButton: string = '';
  @Output() callActivateButton = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  onActiveButton(buttonActive: string) {
    this.callActivateButton.emit(buttonActive);
  }
}
