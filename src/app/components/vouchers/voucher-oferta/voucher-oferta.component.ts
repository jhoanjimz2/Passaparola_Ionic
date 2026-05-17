import { Component, EventEmitter, Input, Output }         from '@angular/core';
import { Voucher }                                        from 'src/app/shared/interfaces/vouchers/vouchers';

@Component({
  selector: 'app-voucher-oferta',
  templateUrl: './voucher-oferta.component.html',
  styleUrls: ['./voucher-oferta.component.scss'],
})
export class VoucherOfertaComponent {
  @Input() toggle:boolean = false;
  @Input() voucher:Voucher = {} as Voucher;
  @Output() activeInactive: EventEmitter<any> = new EventEmitter<any>();
  @Output() qrVoucher: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  viewQrVoucher() {
    this.qrVoucher.emit()
  }

  changeToggle(event: any) {
    if (event.detail.checked) {
      this.activeInactive.emit(true)
      setTimeout(() => { this.voucher.isActive = false; }, 150);
    } else {
      this.activeInactive.emit(false)
      setTimeout(() => { this.voucher.isActive = true; }, 150);
    }
  }

}
