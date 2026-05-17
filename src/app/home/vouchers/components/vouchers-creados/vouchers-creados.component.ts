import { Component, OnDestroy }  from '@angular/core';
import { ModalController }       from '@ionic/angular';
import { CrearVoucherComponent } from '../crear-voucher/crear-voucher.component';
import { Voucher }               from 'src/app/shared/interfaces/vouchers/vouchers';
import { Subscription }          from 'rxjs';
import { VouchersService }       from 'src/app/shared/services';
import { SuspenderComponent }    from '../suspender/suspender.component';
import { ActivarComponent }      from '../activar/activar.component';

@Component({
  selector: 'app-vouchers-creados',
  templateUrl: './vouchers-creados.component.html',
  styleUrls: ['./vouchers-creados.component.scss'],
})
export class VouchersCreadosComponent implements OnDestroy {

  vouchersCreated: Voucher[] = [];
  private subscription!: Subscription;

  constructor(
    private modalController: ModalController,
    private vouchersService: VouchersService
  ) {
    this.subscription = this.vouchersService.obtenerMyVouchersCreated().subscribe({
      next: (vouchers) => { this.vouchersCreated = structuredClone(vouchers); }
    });
  }
  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  async openCreateVoucher() {
    const modal = await this.modalController.create({
      component: CrearVoucherComponent,
      backdropDismiss: true,
    });
    modal.present();
  }

  activeInactive(event: any, voucher: any) {
    if (event) this.activar(voucher)
    if (!event) this.suspender(voucher)
  }

  async suspender(voucher: any) {
    const modal = await this.modalController.create({
      component: SuspenderComponent,
      backdropDismiss: true,
      cssClass: 'modal-act-inact'
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) this.activeInactiveService(voucher, data.data);
  }

  async activar(voucher: any) {
    const modal = await this.modalController.create({
      component: ActivarComponent,
      backdropDismiss: true,
      cssClass: 'modal-act-inact'
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) this.activeInactiveService(voucher, data.data);
  }

  activeInactiveService(voucher: any, data: any) {
    this.vouchersService.activeInactive(voucher.id).subscribe({
      next: () => {
        voucher.isActive = data;
      }
    })
  }

}
