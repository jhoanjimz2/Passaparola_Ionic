import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Ticket }                                            from 'src/app/shared/interfaces/events/events';

@Component({
  selector: 'app-voucher-entrada-event',
  templateUrl: './voucher-entrada-event.component.html',
  styleUrls: ['./voucher-entrada-event.component.scss'],
})
export class VoucherEntradaEventComponent implements OnDestroy {
  @Input() ticket: Ticket = {} as Ticket;
  @Input() selectTicket: Ticket | null = null;
  @Input() border: boolean = false;
  @Input() cantidad: number | null = null;
  @Input() price: number | null = null;
  @Output() qrVoucher: EventEmitter<any> = new EventEmitter<any>();
  ngOnDestroy(): void {}
  viewQrVoucher() {
    this.qrVoucher.emit()
  }
}

