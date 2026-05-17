import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'list',
    loadChildren: () =>
      import('./pages/bank-account-list/bank-account-list.module').then(
        (m) => m.BankAccountListPageModule
      ),
  },
  {
    path: 'create',
    loadChildren: () =>
      import('./pages/bank-account-create/bank-account-create.module').then(
        (m) => m.BankAccountCreatePageModule
      ),
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankAccountPageRoutingModule {}
