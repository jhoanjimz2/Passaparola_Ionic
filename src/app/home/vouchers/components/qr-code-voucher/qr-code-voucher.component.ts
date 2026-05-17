import { Component, Input, OnDestroy } from '@angular/core';
import { Product, Ticket } from 'src/app/shared/interfaces/events/events';
import { Voucher } from 'src/app/shared/interfaces/vouchers/vouchers';

@Component({
  selector: 'app-qr-code-voucher',
  templateUrl: './qr-code-voucher.component.html',
  styleUrls: ['./qr-code-voucher.component.scss'],
})
export class QrCodeVoucherComponent implements OnDestroy {
  @Input() voucher: Voucher = {};

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

  isTicketOrProduct(
    item: Voucher | Ticket | Product
  ): item is Ticket | Product {
    return !!(item as Ticket).event?.processStatus;
  }
}
