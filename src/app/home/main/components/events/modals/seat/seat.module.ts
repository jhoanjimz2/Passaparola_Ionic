import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { IonicModule }                      from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule }                 from '@angular/google-maps';
import { MaterialModule }                   from 'src/app/shared/material/material.module';
import { PipesModule }                      from 'src/app/shared/pipes/pipes.module';
import { SeatNameComponent }                from './seat-name/seat-name.component';
import { SeatDescriptionComponent }         from './seat-description/seat-description.component';
import { SeatInfoComponent }                from './seat-info/seat-info.component';
import { SeatGalleryComponent }             from './seat-gallery/seat-gallery.component';
import { SeatLocationComponent }            from './seat-location/seat-location.component';
import { SeatTagsComponent }                from './seat-tags/seat-tags.component';
import { SeatScheduleComponent }            from './seat-schedule/seat-schedule.component';
import { SeatCategoryComponent }            from './seat-category/seat-category.component';
import { SeatTicketsComponent }             from './seat-tickets/seat-tickets.component';
import { SeatDateComponent }                from './seat-date/seat-date.component';
import { SeatServiceComponent }             from './seat-service/seat-service.component';
import { SeatGreenComponent }               from './seat-green/seat-green.component';
import { SeatTicketsViewComponent }         from './seat-tickets-view/seat-tickets-view.component';
import { SeatViewImageComponent }           from './seat-view-image/seat-view-image.component';
import { SeatViewStatsComponent }           from './seat-view-stats/seat-view-stats.component';
import { ComponentModule }                  from 'src/app/components/component.module';
import { DirectivesModule }                 from 'src/app/shared/directives/directives.module';
import { ComponentsEventsModule }           from '../../components/components-events.module';
@NgModule({
  declarations: [
    SeatNameComponent,
    SeatDescriptionComponent,
    SeatInfoComponent,
    SeatGalleryComponent,
    SeatLocationComponent,
    SeatTagsComponent,
    SeatScheduleComponent,
    SeatCategoryComponent,
    SeatTicketsComponent,
    SeatTicketsComponent,
    SeatDateComponent,
    SeatServiceComponent,
    SeatGreenComponent,
    SeatTicketsViewComponent,
    SeatViewImageComponent,
    SeatViewStatsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    GoogleMapsModule,
    MaterialModule,
    ComponentModule,
    DirectivesModule,
    ComponentsEventsModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class SeatModule { }
