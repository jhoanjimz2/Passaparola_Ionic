import { CUSTOM_ELEMENTS_SCHEMA, NgModule }                      from '@angular/core';
import { CommonModule }                                          from '@angular/common';
import { FormsModule }                                           from '@angular/forms';

import { IonicModule }                                           from '@ionic/angular';

import { CartPageRoutingModule }                                 from './cart-routing.module';

import { CartPage }                                              from './cart.page';
import { ComponentModule }                                       from 'src/app/components/component.module';
import { ProductCartComponent }                                  from './components/product-cart/product-cart.component';
import { ProductForYouComponent }                                from './components/product-for-you/product-for-you.component';
import { ProductSavedForLaterComponent }                         from './components/product-saved-for-later/product-saved-for-later.component';
import { ProductBuyAgainComponent }                              from './components/product-buy-again/product-buy-again.component';
import { PipesModule }                                           from 'src/app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CartPageRoutingModule,
    ComponentModule,
    PipesModule
  ],
  declarations: [
    CartPage,
    ProductCartComponent,
    ProductForYouComponent,
    ProductSavedForLaterComponent,
    ProductBuyAgainComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CartPageModule {}
