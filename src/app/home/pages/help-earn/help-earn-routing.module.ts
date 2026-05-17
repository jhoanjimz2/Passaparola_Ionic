import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelpEarnPage } from './help-earn.page';

const routes: Routes = [
  {
    path: '',
    component: HelpEarnPage,
    children: [
      {
        path: 'information',
        loadChildren: () =>
          import('./pages/information/information.module').then(
            (m) => m.InformationPageModule
          ),
      },
      {
        path: 'register',
        loadChildren: () =>
          import('./pages/register/register.module').then(
            (m) => m.RegisterPageModule
          ),
      },
      {
        path: '',
        redirectTo: 'information',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpEarnPageRoutingModule {}
