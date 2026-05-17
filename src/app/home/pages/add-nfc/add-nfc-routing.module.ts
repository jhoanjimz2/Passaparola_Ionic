import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddNFCPage } from './add-nfc.page';

const routes: Routes = [
  {
    path: '',
    component: AddNFCPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddNFCPageRoutingModule {}
