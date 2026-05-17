import { Component, OnDestroy } from '@angular/core';
import { ModalController }      from '@ionic/angular';
import { Subscription }         from 'rxjs';
import { Events }               from 'src/app/shared/interfaces/events/events';
import { EventsService }        from 'src/app/shared/services';
import { SeatTicketsComponent } from '../seat-tickets/seat-tickets.component';

@Component({
  selector: 'app-seat-tickets-view',
  templateUrl: './seat-tickets-view.component.html',
  styleUrls: ['./seat-tickets-view.component.scss'],
})
export class SeatTicketsViewComponent implements OnDestroy {

  eventProfile: Events = {} as Events;
  private subscription!: Subscription;

  constructor(
    private modalController: ModalController,
    private eventsService: EventsService
  ) {
    this.subscription = this.eventsService.obtenerEventSelect().subscribe({
      next: (event) => { this.eventProfile = structuredClone(event); }
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
  close() {
    this.modalController.dismiss();
  }

  async create(index?: number) {
    let ticket = index !== undefined ? this.eventProfile.tickets![index] : null;
    const modal = await this.modalController.create({
      component: SeatTicketsComponent,
      componentProps:{ ticket },
      cssClass: 'modal-95vh',
      backdropDismiss: true
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
  }

}
