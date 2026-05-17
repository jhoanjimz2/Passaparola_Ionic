import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvestimentiPage } from './investimenti.page';

const routes: Routes = [
  {
    path: '',
    component: InvestimentiPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestimentiPageRoutingModule {}
