import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Product }                                           from 'src/app/shared/interfaces/events/events';

@Component({
  selector: 'app-voucher-extra-event',
  templateUrl: './voucher-extra-event.component.html',
  styleUrls: ['./voucher-extra-event.component.scss'],
})
export class VoucherExtraEventComponent implements OnDestroy  {
  @Input() ticketExtra: Product = {} as Product;
  @Input() buy: boolean = false;
  @Input() cantidad: number = 1;
  @Output() seatService: EventEmitter<any> = new EventEmitter<any>();
  @Output() viewImage: EventEmitter<any> = new EventEmitter<any>();
  @Output() buying: EventEmitter<any> = new EventEmitter<any>();
  @Output() qrVoucher: EventEmitter<any> = new EventEmitter<any>();

  ngOnDestroy(): void {}

  seatOpenViewImage() {
    this.viewImage.emit();
  }
  openSeatServiceComponent() {
    this.seatService.emit();
  }
  comprar() {
    this.buying.emit();
  }
  viewQrVoucher() {
    this.qrVoucher.emit()
  }

}
