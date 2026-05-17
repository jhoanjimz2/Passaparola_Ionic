import { CUSTOM_ELEMENTS_SCHEMA, NgModule }                          from '@angular/core';
import { CommonModule }                                              from '@angular/common';
import { FormsModule }                                               from '@angular/forms';

import { IonicModule }                                               from '@ionic/angular';

import { ReceiptsVouchersPageRoutingModule }                         from './receipts-vouchers-routing.module';

import { ReceiptsVouchersPage }                                      from './receipts-vouchers.page';
import { ComponentModule }                                           from 'src/app/components/component.module';
import { ReceiptVoucherComponent }                                   from './receipt-voucher/receipt-voucher.component';
import { PipesModule }                                               from 'src/app/shared/pipes/pipes.module';
import { NgxQrcodeStylingModule }                                    from 'ngx-qrcode-styling';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceiptsVouchersPageRoutingModule,
    ComponentModule,
    PipesModule,
    NgxQrcodeStylingModule
  ],
  declarations: [
    ReceiptsVouchersPage,
    ReceiptVoucherComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReceiptsVouchersPageModule {}
