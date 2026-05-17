import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PassaparolaCardPage } from './passaparola-card.page';

const routes: Routes = [
  {
    path: '',
    component: PassaparolaCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PassaparolaCardPageRoutingModule {}
