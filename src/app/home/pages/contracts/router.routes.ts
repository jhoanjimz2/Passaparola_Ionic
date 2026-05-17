import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./pages/list/list.page').then( m => m.ListPage)
  },
  {
    path: 'view-contract/:id',
    loadComponent: () => import('./pages/view-contract/view-contract.page').then( m => m.ViewContractPage)
  }
];
