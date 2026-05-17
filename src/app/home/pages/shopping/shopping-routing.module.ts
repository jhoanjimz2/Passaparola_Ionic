import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoppingPage }         from './shopping.page';

const routes: Routes = [
  {
    path: '',
    component: ShoppingPage,
    children:[
      {
        path: 'receipts-vouchers',
        loadChildren: () => import('./receipts-vouchers/receipts-vouchers.module').then( m => m.ReceiptsVouchersPageModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
      },
      {
        path: 'pay-cart',
        loadChildren: () => import('./pay-cart/pay-cart.module').then( m => m.PayCartPageModule)
      },
      {
        path: 'order-cart',
        loadChildren: () => import('./order-cart/order-cart.module').then( m => m.OrderCartPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShoppingPageRoutingModule {}
