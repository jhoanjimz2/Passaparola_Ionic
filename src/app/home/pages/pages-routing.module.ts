import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesPage }            from './pages.page';
import { CheckTokenGuard }      from 'src/app/core/guards/check-token.guard';
import { LoginGuard }           from 'src/app/core/guards/login.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesPage,
    children: [
      {
        path: 'shopping',
        canActivate: [CheckTokenGuard, LoginGuard],
        loadChildren: () =>
          import('./shopping/shopping.module').then(
            (m) => m.ShoppingPageModule
          ),
      },
      {
        path: 'profile',
        canActivate: [CheckTokenGuard, LoginGuard],
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfilePageModule),
      },
      {
        path: 'bank-card',
        canActivate: [CheckTokenGuard, LoginGuard],
        loadChildren: () =>
          import('./bank-card/bank-card.module').then(
            (m) => m.BankCardPageModule
          ),
      },
      {
        path: 'bank-account',
        canActivate: [CheckTokenGuard, LoginGuard],
        loadChildren: () =>
          import('./bank-account/bank-account.module').then(
            (m) => m.BankAccountPageModule
          ),
      },
      {
        path: 'company',
        canActivate: [CheckTokenGuard, LoginGuard],
        loadChildren: () =>
          import('./company/company.module').then((m) => m.CompanyPageModule),
      },
      {
        path: 'event-suggested',
        loadChildren: () =>
          import('./event-suggested/event-suggested.module').then(
            (m) => m.EventSuggestedPageModule
          ),
      },
      {
        path: 'suggested',
        loadChildren: () =>
          import('./suggested/suggested.module').then(
            (m) => m.SuggestedPageModule
          ),
      },
      {
        path: 'passaparola-card',
        loadChildren: () =>
          import('./passaparola-card/passaparola-card.module').then(
            (m) => m.PassaparolaCardPageModule
          ),
      },
      {
        path: 'help-earn',
        loadChildren: () =>
          import('./help-earn/help-earn.module').then(
            (m) => m.HelpEarnPageModule
          ),
      },
      {
        path: 'add-nfc',
        loadChildren: () =>
          import('./add-nfc/add-nfc.module').then((m) => m.AddNFCPageModule),
      },
      {
        path: 'house-garden',
        loadChildren: () => import('./house-garden/router.routes').then((m) => m.routes),
      },
      {
        path: 'jointlybuy',
        loadChildren: () => import('./jointlybuy/router.routes').then((m) => m.routes),
      },
      {
        path: 'events',
        loadChildren: () => import('./events/router.routes').then((m) => m.routes),
      },
      {
        path: 'address',
        loadChildren: () => import('./address/router.routes').then((m) => m.routes),
      },
      {
        path: 'contracts',
        loadChildren: () => import('./contracts/router.routes').then((m) => m.routes),
      },
      {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesPageRoutingModule {}
