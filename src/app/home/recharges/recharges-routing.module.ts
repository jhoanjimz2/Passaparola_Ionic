import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RechargesPage } from './recharges.page';

const routes: Routes = [
  {
    path: '',
    component: RechargesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RechargesPageRoutingModule {}
