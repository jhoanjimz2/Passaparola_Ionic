import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HelpEarnPageRoutingModule } from './help-earn-routing.module';
import { HelpEarnPage } from './help-earn.page';
import { CreateSuccesfullyComponent } from './components/create-succesfully/create-succesfully.component';
import { ComponentModule } from 'src/app/components/component.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelpEarnPageRoutingModule,
    ComponentModule,
    TranslateModule,
  ],
  declarations: [HelpEarnPage, CreateSuccesfullyComponent],
})
export class HelpEarnPageModule {}
