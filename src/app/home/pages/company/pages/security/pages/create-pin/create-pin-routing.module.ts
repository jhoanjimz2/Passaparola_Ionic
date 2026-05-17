import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePinPage } from './create-pin.page';

const routes: Routes = [
  {
    path: '',
    component: CreatePinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatePinPageRoutingModule {}
