import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit }                   from '@angular/core';

@Component({
  selector: 'app-receipts-vouchers',
  templateUrl: './receipts-vouchers.page.html',
  styleUrls: ['./receipts-vouchers.page.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class ReceiptsVouchersPage implements OnInit {
  segmentValue: string = 'Ricevute';

  constructor() { }

  ngOnInit() {
  }

}
