import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankAccountListPage } from './bank-account-list.page';

const routes: Routes = [
  {
    path: '',
    component: BankAccountListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankAccountListPageRoutingModule {}
