import { NgModule }              from '@angular/core';
import { CommonModule }          from '@angular/common';
import { IonicModule }           from '@ionic/angular';

import { TranslateModule }       from '@ngx-translate/core';

import { SeatPageRoutingModule } from './seat-routing.module';

import { SeatPage }              from './seat.page';
import { ComponentModule }       from 'src/app/components/component.module';
import { SeatListComponent }     from './components/seat-list/seat-list.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SeatPageRoutingModule,
    ComponentModule,
    TranslateModule,
    SeatListComponent
  ],
  declarations: [
    SeatPage
  ],
})
export class SeatPageModule {}
