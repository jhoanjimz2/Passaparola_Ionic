import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MegaStoresPageRoutingModule } from './mega-stores-routing.module';

import { MegaStoresPage } from './mega-stores.page';
import { ComponentModule } from 'src/app/components/component.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MegaStoresPageRoutingModule,
    ComponentModule,
  ],
  declarations: [MegaStoresPage],
})
export class MegaStoresPageModule {}
