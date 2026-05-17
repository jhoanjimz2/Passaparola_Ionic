import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { SlideCategoriesEventsComponent }   from './slide-categories-events/slide-categories-events.component';
import { IonicModule }                      from '@ionic/angular';
import { ComponentModule }                  from 'src/app/components/component.module';
import { PipesModule }                      from 'src/app/shared/pipes/pipes.module';
import { NearestEventCardComponent }        from './nearest-event-card/nearest-event-card.component';
import { MapComponent }                     from './map/map.component';
import { PortadaProfileEventComponent }     from './portada-profile-event/portada-profile-event.component';
import { GoogleMapsModule }                 from '@angular/google-maps';
import { QrTicketComponent }                from '../../../../../components/qr-ticket/qr-ticket.component';
import { NgxQrcodeStylingModule }           from 'ngx-qrcode-styling';
import { SearchBarComponent }               from './search-bar/search-bar.component';
import { FormsModule }                      from '@angular/forms';



@NgModule({
  declarations: [
    SlideCategoriesEventsComponent,
    NearestEventCardComponent,
    MapComponent,
    PortadaProfileEventComponent,
    SearchBarComponent
  ],
  exports:[
    SlideCategoriesEventsComponent,
    NearestEventCardComponent,
    MapComponent,
    PortadaProfileEventComponent,
    SearchBarComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ComponentModule,
    PipesModule,
    GoogleMapsModule,
    NgxQrcodeStylingModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsEventsModule { }
