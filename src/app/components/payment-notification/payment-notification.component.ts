import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-payment-notification',
  templateUrl: './payment-notification.component.html',
  styleUrls: ['./payment-notification.component.scss'],
})
export class PaymentNotificationComponent {
  @Input() nameImg: string = '';
  @Input() subTitle: string = '';
  @Input() textBtnClose: string = '';
  @Input() title: string = '';
  @Input() type: 'success' | 'cancel' = 'success';
}
