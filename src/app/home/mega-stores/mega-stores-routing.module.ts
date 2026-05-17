import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MegaStoresPage } from './mega-stores.page';

const routes: Routes = [
  {
    path: '',
    component: MegaStoresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MegaStoresPageRoutingModule {}
