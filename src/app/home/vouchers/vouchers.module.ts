import { NgModule }                         from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule }                      from '@ionic/angular';
import { VouchersPageRoutingModule }        from './vouchers-routing.module';
import { VouchersPage }                     from './vouchers.page';
import { CrearVoucherComponent }            from './components/crear-voucher/crear-voucher.component';
import { VouchersCreadosComponent }         from './components/vouchers-creados/vouchers-creados.component';
import { ComponentModule }                  from 'src/app/components/component.module';
import { SuspenderComponent }               from './components/suspender/suspender.component';
import { ActivarComponent }                 from './components/activar/activar.component';
import { DirectivesModule }                 from 'src/app/shared/directives/directives.module';
import { VouchersCompradosComponent }       from './components/vouchers-comprados/vouchers-comprados.component';
import { QrCodeVoucherComponent }           from './components/qr-code-voucher/qr-code-voucher.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VouchersPageRoutingModule,
    ComponentModule,
    DirectivesModule,
  ],
  declarations: [
    VouchersPage,
    CrearVoucherComponent,
    VouchersCreadosComponent,
    SuspenderComponent,
    ActivarComponent,
    VouchersCompradosComponent,
    QrCodeVoucherComponent
  ]
})
export class VouchersPageModule {}
