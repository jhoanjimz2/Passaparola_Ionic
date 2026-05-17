import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformationPageRoutingModule } from './information-routing.module';

import { TranslateModule } from '@ngx-translate/core';

import { InformationPage } from './information.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformationPageRoutingModule,
    ComponentModule,
    TranslateModule,
  ],
  declarations: [InformationPage],
})
export class InformationPageModule {}
