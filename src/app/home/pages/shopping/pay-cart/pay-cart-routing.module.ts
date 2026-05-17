import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PayCartPage } from './pay-cart.page';

const routes: Routes = [
  {
    path: '',
    component: PayCartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayCartPageRoutingModule {}
