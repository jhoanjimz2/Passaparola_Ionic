import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'addresses',
    pathMatch: 'full'
  },
  {
    path: 'addresses',
    loadComponent: () => import('./pages/addresses/addresses.page').then(m => m.AddressesPage)
  },
  {
    path: 'create-address',
    loadComponent: () => import('./pages/create-address/create-address.page').then(m => m.CreateAddressPage)
  },
  {
    path: 'create-address/:id',
    loadComponent: () => import('./pages/create-address/create-address.page').then(m => m.CreateAddressPage)
  }
];
