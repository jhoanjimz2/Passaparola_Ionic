import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'list',
    loadChildren: () =>
      import('./pages/bank-card-list/bank-card-list.module').then(
        (m) => m.BankCardListPageModule
      ),
  },
  {
    path: 'create',
    loadChildren: () =>
      import('./pages/bank-card-create/bank-card-create.module').then(
        (m) => m.BankCardCreatePageModule
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
export class BankCardPageRoutingModule {}
