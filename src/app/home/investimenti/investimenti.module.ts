import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvestimentiPageRoutingModule } from './investimenti-routing.module';

import { InvestimentiPage } from './investimenti.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvestimentiPageRoutingModule
  ],
  declarations: [InvestimentiPage]
})
export class InvestimentiPageModule {}
