import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SeatPage }             from './seat.page';


const routes: Routes = [
  {
    path: '',
    component: SeatPage,
  },
  {
    path: 'modify/:id',
    loadComponent: () => import('./pages/profile-social-multiple/profile-social-multiple.component').then( m => m.ProfileSocialMultipleComponent)
  },
  {
    path: 'modify-simple/:id',
    loadComponent: () => import('./pages/profile-social-simple/profile-social-simple.component').then( m => m.ProfileSocialSimpleComponent)
  },
  {
    path: 'view-post/:id',
    loadComponent: () => import('./pages/view-post/view-post.component').then( m => m.ViewPostComponent)
  },
  {
    path: 'search-post/:keyword',
    loadComponent: () => import('./pages/search-post/search-post.component').then( m => m.SearchPostComponent)
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SeatPageRoutingModule {}
