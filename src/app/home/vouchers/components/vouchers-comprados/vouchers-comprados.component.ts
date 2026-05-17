import { Component }                from '@angular/core';
import { Subscription }             from 'rxjs';
import { Voucher }                  from 'src/app/shared/interfaces/vouchers/vouchers';
import { VouchersService }          from 'src/app/shared/services';
import { QrCodeVoucherComponent }   from '../qr-code-voucher/qr-code-voucher.component';
import { ModalController }          from '@ionic/angular';

@Component({
  selector: 'app-vouchers-comprados',
  templateUrl: './vouchers-comprados.component.html',
  styleUrls: ['./vouchers-comprados.component.scss'],
})
export class VouchersCompradosComponent {

  vouchersComprados: Voucher[] = [];
  private subscription!: Subscription;

  constructor(
    private vouchersService: VouchersService,
    private modalController: ModalController
  ) {
    this.subscription = this.vouchersService.obtenerMyVouchersComprados().subscribe({
      next: (vouchers) => this.vouchersComprados = structuredClone(vouchers)
    });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  handleRefresh(event: any) {
    this.vouchersService.dataGeneralVouchers();
    setTimeout(() => event.target.complete(), 100);
  }

  async verQr(voucher: Voucher) {
    const modal = await this.modalController.create({
      component: QrCodeVoucherComponent,
      componentProps: { voucher },
      backdropDismiss: true,
    });
    modal.present();
  }


}
