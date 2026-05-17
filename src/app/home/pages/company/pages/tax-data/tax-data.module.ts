import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaxDataPageRoutingModule } from './tax-data-routing.module';

import { TaxDataPage } from './tax-data.page';
import { ComponentModule } from 'src/app/components/component.module';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { AddressOnTheMapComponent } from './components/address-on-the-map/address-on-the-map.component';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaxDataPageRoutingModule,
    ComponentModule,
    ReactiveFormsModule,
    TranslateModule,
    PipesModule,
    GoogleMapsModule,
  ],
  declarations: [TaxDataPage, AddressOnTheMapComponent],
})
export class TaxDataPageModule {}
