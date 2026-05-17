import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompanyPage } from './company.page';

const routes: Routes = [
  {
    path: '',
    component: CompanyPage,
  },
  {
    path: 'tax-data',
    loadChildren: () =>
      import('./pages/tax-data/tax-data.module').then(
        (m) => m.TaxDataPageModule
      ),
  },
  {
    path: 'seat',
    loadChildren: () =>
      import('./pages/seat/seat.module').then((m) => m.SeatPageModule),
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./pages/contact/contact.module').then((m) => m.ContactPageModule),
  },
  {
    path: 'security',
    loadChildren: () =>
      import('./pages/security/security.module').then(
        (m) => m.SecurityPageModule
      ),
  },
  {
    path: 'promotional materials',
    loadChildren: () =>
      import('./pages/promotional-mat/promotional-mat.module').then(
        (m) => m.PromotionalMatPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyPageRoutingModule {}
