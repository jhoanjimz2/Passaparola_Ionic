import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';

import { BankCardCreatePageRoutingModule } from './bank-card-create-routing.module';

import { BankCardCreatePage } from './bank-card-create.page';
import { ComponentModule } from 'src/app/components/component.module';
import { DirectivesModule } from 'src/app/shared/directives/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    BankCardCreatePageRoutingModule,
    ComponentModule,
    TranslateModule,
    DirectivesModule,
  ],
  declarations: [BankCardCreatePage],
})
export class BankCardCreatePageModule {}
