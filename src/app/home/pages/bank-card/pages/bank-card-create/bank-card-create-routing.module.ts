import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BankCardCreatePage } from './bank-card-create.page';

const routes: Routes = [
  {
    path: '',
    component: BankCardCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankCardCreatePageRoutingModule {}
