import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyEventsComponent } from './my-events/my-events.component';
import { MyEventsOrganizatedComponent } from './my-events-organizated/my-events-organizated.component';
import { EventProfileComponent } from './event-profile/event-profile.component';
import { IonicModule } from '@ionic/angular';
import { ComponentModule } from 'src/app/components/component.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { QrCodeEventComponent } from './qr-code-event/qr-code-event.component';
import { QrCodeScanedComponent } from './qr-code-scaned/qr-code-scaned.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { PayTicketComponent } from './pay-ticket/pay-ticket.component';
import { SeatModule } from './seat/seat.module';
import { AllEventsComponent } from './all-events/all-events.component';
import { ComponentsEventsModule } from '../components/components-events.module';
import { EventPublishComponent } from './event-publish/event-publish.component';
import { FormsModule } from '@angular/forms';
import { PayTicketExtraComponent } from './pay-ticket-extra/pay-ticket-extra.component';
import { FilterCategoryComponent } from './filter-category/filter-category.component';
import { PendingEventPrivateComponent } from './pending-event-private/pending-event-private.component';
import { FormattNumberPipe } from 'src/app/shared/pipes';

@NgModule({
  declarations: [
    MyEventsComponent,
    MyEventsOrganizatedComponent,
    EventProfileComponent,
    QrCodeEventComponent,
    QrCodeScanedComponent,
    PayTicketComponent,
    PayTicketExtraComponent,
    AllEventsComponent,
    EventPublishComponent,
    FilterCategoryComponent,
    PendingEventPrivateComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ComponentModule,
    PipesModule,
    GoogleMapsModule,
    SeatModule,
    ComponentsEventsModule,
    FormsModule,
    FormattNumberPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ModalsEventsModule {}
