import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayCartPageRoutingModule } from './pay-cart-routing.module';

import { PayCartPage } from './pay-cart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayCartPageRoutingModule
  ],
  declarations: [PayCartPage]
})
export class PayCartPageModule {}
