import { NgModule }                                from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LoginGuard }                              from './core/guards/login.guard';
import { CheckTokenGuard }                         from './core/guards/check-token.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./home/layout/layout.module').then((m) => m.LayoutPageModule),
    canActivate: [LoginGuard, CheckTokenGuard],
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./home/pages/pages.module').then((m) => m.PagesPageModule),
      canActivate: [LoginGuard, CheckTokenGuard],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./authentication/login/login.module').then(
        (m) => m.LoginPageModule
      ),
  },
  {
    path: 'change-pin',
    loadChildren: () =>
      import('./authentication/change-pin/change-pin.module').then(
        (m) => m.ChangePinPageModule
      ),
  },
  {
    path: 'sing-up',
    loadChildren: () =>
      import('./authentication/sing-up/sing-up.module').then(
        (m) => m.SingUpPageModule
      ),
  },
  {
    path: 'view-willbuy/:id',
    loadComponent: () => import('./home/pages/jointlybuy/pages/view-willbuy/view-willbuy.page').then( m => m.ViewWillbuyPage)
  },
  {
    path: 'modify-simple/:id',
    loadComponent: () => import('./home/pages/company/pages/seat/pages/profile-social-simple/profile-social-simple.component').then( m => m.ProfileSocialSimpleComponent)
  },
  {
    path: 'modify/:id',
    loadComponent: () => import('./home/pages/company/pages/seat/pages/profile-social-multiple/profile-social-multiple.component').then( m => m.ProfileSocialMultipleComponent)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
