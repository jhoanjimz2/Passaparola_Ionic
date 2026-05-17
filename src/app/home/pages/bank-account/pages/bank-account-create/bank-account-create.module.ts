import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { BankAccountCreatePageRoutingModule } from './bank-account-create-routing.module';

import { ComponentModule } from 'src/app/components/component.module';

import { BankAccountCreatePage } from './bank-account-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BankAccountCreatePageRoutingModule,
    ComponentModule,
    TranslateModule,
  ],
  declarations: [BankAccountCreatePage],
})
export class BankAccountCreatePageModule {}
