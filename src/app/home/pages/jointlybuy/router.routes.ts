import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'create-wishbuy',
    loadComponent: () => import('./pages/create-wishbuy/create-wishbuy.component').then(m => m.CreateWishbuyComponent),
  },
  {
    path: 'view-willbuys',
    loadComponent: () => import('./pages/view-willbuys/view-willbuys.page').then( m => m.ViewWillbuysPage)
  },
  {
    path: 'view-willbuy/:id',
    loadComponent: () => import('./pages/view-willbuy/view-willbuy.page').then( m => m.ViewWillbuyPage)
  },
  {
    path: 'view-willbuys-category/:id',
    loadComponent: () => import('./pages/view-willbuys-category/view-willbuys-category.page').then( m => m.ViewWillbuysCategoryPage)
  },
  {
    path: 'view-willbuys-popular',
    loadComponent: () => import('./pages/view-willbuys-popular/view-willbuys-popular.page').then( m => m.ViewWillbuysPopularPage)
  },
  {
    path: 'view-willbuys-deadline',
    loadComponent: () => import('./pages/view-willbuys-deadline/view-willbuys-deadline.page').then( m => m.ViewWillbuysDeadlinePage)
  }
];
