import { Component, OnDestroy }       from '@angular/core';
import { ModalController }            from '@ionic/angular';
import { VouchersCreadosComponent }   from './components/vouchers-creados/vouchers-creados.component';
import { VouchersService }            from 'src/app/shared/services';
import { Subscription }               from 'rxjs';
import { Voucher }                    from 'src/app/shared/interfaces/vouchers/vouchers';
import { VouchersCompradosComponent } from './components/vouchers-comprados/vouchers-comprados.component';

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.page.html',
  styleUrls: ['./vouchers.page.scss'],
})
export class VouchersPage implements OnDestroy {

  user:any;

  alVouchers: Voucher[] = [];
  countVouchersCreados: number = 0;
  countVouchersComprados: number = 0;

  private subscription!: Subscription;
  private subscription2!: Subscription;
  private subscription3!: Subscription;

  constructor(
    private modalController: ModalController,
    private vouchersService: VouchersService
  ) {
    this.user = JSON.parse(localStorage.getItem('appPassaparola_user')!);
    this.subscription = this.vouchersService.obtenerAllVouchers().subscribe({
      next: (events) => { this.alVouchers = events; }
    });
    this.subscription2 = this.vouchersService.obtenerMyVouchersCreated().subscribe({
      next: (events) => { this.countVouchersCreados = events.length; }
    });
    this.subscription3 = this.vouchersService.obtenerMyVouchersComprados().subscribe({
      next: (events) => { this.countVouchersComprados = events.length;  }
    });
  }
  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
    if (this.subscription3) this.subscription3.unsubscribe();
  }

  async openVouchersCreados() {
    const modal = await this.modalController.create({
      component: VouchersCreadosComponent,
      backdropDismiss: true,
    });
    modal.present();
  }
  async openVouchersComprados() {
    const modal = await this.modalController.create({
      component: VouchersCompradosComponent,
      backdropDismiss: true,
    });
    modal.present();
  }

}
