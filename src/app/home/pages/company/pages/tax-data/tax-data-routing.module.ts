import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaxDataPage } from './tax-data.page';

const routes: Routes = [
  {
    path: '',
    component: TaxDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxDataPageRoutingModule {}
