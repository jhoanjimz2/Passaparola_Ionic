import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { FormsModule }                      from '@angular/forms';

import { IonicModule }                      from '@ionic/angular';

import { EventSuggestedPageRoutingModule }  from './event-suggested-routing.module';

import { EventSuggestedPage }               from './event-suggested.page';
import { PipesModule }                      from 'src/app/shared/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventSuggestedPageRoutingModule,
    PipesModule
  ],
  declarations: [EventSuggestedPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventSuggestedPageModule {}
