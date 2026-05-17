import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExternalStoresPage } from './external-stores.page';

const routes: Routes = [
  {
    path: '',
    component: ExternalStoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExternalStoresPageRoutingModule {}
