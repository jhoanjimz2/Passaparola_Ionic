import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReceiptsVouchersPage } from './receipts-vouchers.page';

const routes: Routes = [
  {
    path: '',
    component: ReceiptsVouchersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptsVouchersPageRoutingModule {}
