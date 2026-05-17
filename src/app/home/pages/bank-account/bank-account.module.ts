import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BankAccountPageRoutingModule } from './bank-account-routing.module';

import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BankAccountPageRoutingModule,
    ComponentModule,
  ],
  declarations: [],
})
export class BankAccountPageModule {}
