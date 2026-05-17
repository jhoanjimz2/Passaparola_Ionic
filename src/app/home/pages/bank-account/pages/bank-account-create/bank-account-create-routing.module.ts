import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankAccountCreatePage } from './bank-account-create.page';

const routes: Routes = [
  {
    path: '',
    component: BankAccountCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankAccountCreatePageRoutingModule {}
