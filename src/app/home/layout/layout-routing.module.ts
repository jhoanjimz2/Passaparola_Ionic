import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutPage }           from './layout.page';
import { CheckTokenGuard }      from 'src/app/core/guards/check-token.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutPage,
    children: [
      {
        path: 'main',
        canActivate: [CheckTokenGuard],
        loadChildren: () =>
          import('../main/main.module').then((m) => m.MainPageModule),
      },
      {
        path: 'social',
        canActivate: [CheckTokenGuard],
        loadComponent: () =>
          import('../social/social.component').then((m) => m.SocialComponent),
      },
      {
        path: 'stores',
        canActivate: [CheckTokenGuard],
        loadChildren: () =>
          import('../stores/stores.module').then((m) => m.StoresPageModule),
      },
      {
        path: 'map',
        canActivate: [CheckTokenGuard],
        loadChildren: () =>
          import('../map/map.module').then((m) => m.MapPageModule),
      },
      {
        path: 'professionals',
        canActivate: [CheckTokenGuard],
        loadComponent: () =>
          import('../professionals/pages/professionals/professionals.page').then((m) => m.ProfessionalsPage),
      },
      {
        path: 'mega-stores',
        redirectTo: 'main',
        // canActivate: [CheckTokenGuard],
        // loadChildren: () =>
        //   import('../mega-stores/mega-stores.module').then(
        //     (m) => m.MegaStoresPageModule
        //   ),
      },
      {
        path: 'external-stores',
        canActivate: [CheckTokenGuard],
        loadChildren: () =>
          import('../external-stores/external-stores.module').then(
            (m) => m.ExternalStoresPageModule
          ),
      },
      {
        path: 'wallet',
        canActivate: [CheckTokenGuard],
        loadChildren: () =>
          import('../wallet/wallet.module').then((m) => m.WalletPageModule),
      },
      {
        path: 'community',
        canActivate: [CheckTokenGuard],
        loadChildren: () =>
          import('../community/community.module').then(
            (m) => m.CommunityPageModule
          ),
      },
      {
        path: 'investimenti',
        canActivate: [CheckTokenGuard],
        loadChildren: () =>
          import('../investimenti/investimenti.module').then(
            (m) => m.InvestimentiPageModule
          ),
      },
      {
        path: 'tpv',
        canActivate: [CheckTokenGuard],
        loadChildren: () =>
          import('../payment/payment.module').then((m) => m.TPVPageModule),
      },
      {
        path: 'vouchers',
        canActivate: [CheckTokenGuard],
        loadChildren: () =>
          import('../vouchers/vouchers.module').then(
            (m) => m.VouchersPageModule
          ),
      },
      {
        path: 'recharges',
        canActivate: [CheckTokenGuard],
        loadChildren: () =>
          import('../recharges/recharges.module').then(
            (m) => m.RechargesPageModule
          ),
      },
      // {
      //   path: '',
      //   redirectTo: 'social',
      //   pathMatch: 'full',
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutPageRoutingModule {}
