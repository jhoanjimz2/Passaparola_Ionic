import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { FormsModule }                      from '@angular/forms';

import { IonicModule }                      from '@ionic/angular';

import { OrderCartPageRoutingModule }       from './order-cart-routing.module';

import { OrderCartPage }                    from './order-cart.page';
import { ComponentModule }                  from 'src/app/components/component.module';
import { PaymentLoaderComponent }           from './components/payment-loader/payment-loader.component';
import { PaymentFailComponent }             from './components/payment-fail/payment-fail.component';
import { PaymentEndComponent }              from './components/payment-end/payment-end.component';
import { PipesModule }                      from 'src/app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderCartPageRoutingModule,
    ComponentModule,
    PipesModule
  ],
  declarations: [
    OrderCartPage,
    PaymentLoaderComponent,
    PaymentFailComponent,
    PaymentEndComponent
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderCartPageModule {}
