import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage }          from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
  },
  {
    path: 'identity',
    loadChildren: () =>
      import('./pages/identity/identity.module').then(
        (m) => m.IdentityPageModule
      ),
  },
  {
    path: 'identity-verification',
    loadComponent: () => import('./pages/identity-verification/identity-verification.page').then( m => m.IdentityVerificationPage)
  },
  {
    path: 'contact',
    loadChildren: () =>
      import('./pages/contact/contact.module').then((m) => m.ContactPageModule),
  },
  {
    path: 'security-account',
    loadChildren: () =>
      import('./pages/security/security.module').then(
        (m) => m.SecurityPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
