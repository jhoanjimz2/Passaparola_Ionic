import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankCardListPage } from './bank-card-list.page';

const routes: Routes = [
  {
    path: '',
    component: BankCardListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankCardListPageRoutingModule {}
