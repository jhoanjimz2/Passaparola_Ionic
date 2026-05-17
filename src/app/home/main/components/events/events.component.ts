import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from '@angular/core';
import { ComponentModule }                              from 'src/app/components/component.module';
import { CommonModule }                                 from '@angular/common';
import { EventsService }                                from 'src/app/shared/services';
import { CategoryEvent, Events }                        from 'src/app/shared/interfaces/events/events';
import { AllEventsComponent }                           from './modals/all-events/all-events.component';
import { ModalController }                              from '@ionic/angular';
import { Subscription }                                 from 'rxjs';
import { MyEventsComponent }                            from './modals/my-events/my-events.component';
import { MyEventsOrganizatedComponent }                 from './modals/my-events-organizated/my-events-organizated.component';
import { KeyboardService }                              from 'src/app/shared/services/keyboard.service';
import { ModalsEventsModule }                           from './modals/modals-events.module';
import { ComponentsEventsModule }                       from './components/components-events.module';
import { PendingEventPrivateComponent }                 from './modals/pending-event-private/pending-event-private.component';

@Component({
  selector: 'app-events',
  standalone: true,
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  imports:[ComponentsEventsModule, ComponentModule, CommonModule, ModalsEventsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventsComponent implements OnDestroy {

  private subscription!: Subscription;
  private subscription2!: Subscription;
  private subscription3!: Subscription;
  private subscription4!: Subscription;

  nearestEvent: Events[] = [];
  allCategories: CategoryEvent[] = [];
  countMyEvents: number = 0;
  countMyEventsTicket: number = 0;


  user:any;

  constructor(
    private eventsService: EventsService,
    private modalController: ModalController,
    private keyboardService: KeyboardService
  ) {
    this.user = JSON.parse(localStorage.getItem('appPassaparola_user')!);
    this.subscription = this.eventsService.obtenerAllEvents().subscribe({
      next: (events) => { this.nearestEvent = events; }
    });
    this.subscription2 = this.eventsService.obtenerAllCategorys().subscribe({
      next: (event) => {
        let categories = this.flattenCategories(structuredClone(event))
        this.allCategories = categories;
      }
    });
    this.subscription3 = this.eventsService.obtenerMyEvents().subscribe({
      next: (events) => { this.countMyEvents = events.length; }
    });
    this.subscription4 = this.eventsService.obtenerMyEventsTickets().subscribe({
      next: (events) => { this.countMyEventsTicket = events.length; }
    });
    this.eventsService.dataInitEvents();
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
    if (this.subscription3) this.subscription3.unsubscribe();
    if (this.subscription4) this.subscription4.unsubscribe();
    this.keyboardService.dispose()
  }

  async openMyEvents() {
    const modal = await this.modalController.create({
      component: MyEventsComponent,
    });
    modal.present();
  }
  async openMyEventsOrganizated() {
    if(this.user.rol != 'company') {
      this.openEventPrivatePending();
      return;
    }
    const modal = await this.modalController.create({
      component: MyEventsOrganizatedComponent,
    });
    modal.present();
  }
  async openEventPrivatePending() {
    const modal = await this.modalController.create({
      component: PendingEventPrivateComponent,
      cssClass: [ 'modal-80vh'],
      backdropDismiss: false
    });
    modal.present();
  }

  async openAllEvents() {
    const modal = await this.modalController.create({
      component: AllEventsComponent,
    });
    modal.present();
  }
  handleRefresh(event: any) {
    this.eventsService.reloadDataEvents('all');
    setTimeout(() => event.target.complete(), 100);
  }


  flattenCategories(categories: any[], seen = new Set()): any[] {
    let result: any[] = [];
    categories.forEach(category => {
      if (seen.has(category.id)) return;

      seen.add(category.id);
      result.push({ ...category, children: undefined });
    });
    return result;
  }



}
