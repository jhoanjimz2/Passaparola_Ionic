import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController }                     from '@ionic/angular';
import { Subscription }                        from 'rxjs';
import { EventStats }                          from 'src/app/shared/interfaces/events/events';
import { EventsService }                       from 'src/app/shared/services';

@Component({
  selector: 'app-seat-view-stats',
  templateUrl: './seat-view-stats.component.html',
  styleUrls: ['./seat-view-stats.component.scss'],
})
export class SeatViewStatsComponent implements OnInit, OnDestroy {
  @Input() id: string = '';
  stats: EventStats = {} as EventStats;

  private subscription!: Subscription;

  constructor(
    private modalController: ModalController,
    private eventsService: EventsService
  ) {
    this.subscription = this.eventsService.obtenerEventStats().subscribe({
      next: (stats) => { this.stats = structuredClone(stats); }
    });
  }

  ngOnInit() {
    this.cargarData();
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
  cargarData() {
    this.eventsService.getEventStats(this.id).subscribe();

  }

  close() {
    this.modalController.dismiss();
  }

}
