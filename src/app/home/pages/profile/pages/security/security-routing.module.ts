import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecurityPage } from './security.page';

const routes: Routes = [
  {
    path: '',
    component: SecurityPage,
  },
  {
    path: 'check-code',
    loadChildren: () => import('./pages/check-code/check-code.module').then( m => m.CheckCodePageModule)
  },
  {
    path: 'create-pin',
    loadChildren: () => import('./pages/create-pin/create-pin.module').then( m => m.CreatePinPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecurityPageRoutingModule {}
