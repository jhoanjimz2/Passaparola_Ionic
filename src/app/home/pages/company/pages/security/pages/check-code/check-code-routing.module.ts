import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CheckCodePage } from './check-code.page';

const routes: Routes = [
  {
    path: '',
    component: CheckCodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckCodePageRoutingModule {}
