import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },
  {
    path: 'index',
    loadComponent: () => import('./house-garden-index/house-garden-index.component').then( m => m.HouseGardenIndexComponent),
  },
  {
    path: 'change-light-manager',
    loadComponent: () => import('./change-light-manager/change-light-manager.component').then( m => m.ChangeLightManagerComponent),
  },
  {
    path: 'electric-savings-calculator',
    loadComponent: () => import('./electric-savings-calculator/electric-savings-calculator.component').then( m => m.ElectricSavingsCalculatorComponent),
  }
];
