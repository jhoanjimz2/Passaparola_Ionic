import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { BankAccountListPageRoutingModule } from './bank-account-list-routing.module';

import { ComponentModule } from 'src/app/components/component.module';
import { BankAccountListPage } from './bank-account-list.page';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BankAccountListPageRoutingModule,
    ComponentModule,
    PipesModule,
    TranslateModule,
  ],
  declarations: [BankAccountListPage],
})
export class BankAccountListPageModule {}
