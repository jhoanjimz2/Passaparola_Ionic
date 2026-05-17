import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExternalStoresPageRoutingModule } from './external-stores-routing.module';

import { ExternalStoresPage } from './external-stores.page';
import { ComponentModule } from 'src/app/components/component.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExternalStoresPageRoutingModule,
    ComponentModule,
    TranslateModule,
  ],
  declarations: [ExternalStoresPage],
})
export class ExternalStoresPageModule {}
