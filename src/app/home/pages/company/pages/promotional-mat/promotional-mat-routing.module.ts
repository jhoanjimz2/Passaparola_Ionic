import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromotionalMatPage } from './promotional-mat.page';

const routes: Routes = [
  {
    path: '',
    component: PromotionalMatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromotionalMatPageRoutingModule {}
