import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { ComponentModule } from 'src/app/components/component.module';

import { BankCardListPageRoutingModule } from './bank-card-list-routing.module';

import { BankCardListPage } from './bank-card-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentModule,
    BankCardListPageRoutingModule,
    TranslateModule,
  ],
  declarations: [BankCardListPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BankCardListPageModule {}
