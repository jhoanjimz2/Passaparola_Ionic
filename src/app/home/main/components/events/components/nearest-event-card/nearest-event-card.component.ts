import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SwiperOptions }                           from 'swiper/types';
import { EventProfileComponent }                   from '../../modals/event-profile/event-profile.component';
import { ModalController }                         from '@ionic/angular';
import { Events }                                  from 'src/app/shared/interfaces/events/events';
import { EventsService }                           from 'src/app/shared/services';
import { PayTicketComponent }                      from '../../modals/pay-ticket/pay-ticket.component';

@Component({
  selector: 'app-nearest-event-card',
  templateUrl: './nearest-event-card.component.html',
  styleUrls: ['./nearest-event-card.component.scss'],
})
export class NearestEventCardComponent {
  @ViewChild('swiperGallery', { static: true }) swiperGalleryRefs!: ElementRef;
  @Input() event!:Events;
  isLoading: boolean = true;
  swiperGalleryConfig: SwiperOptions = {
    slidesPerView: 2,
    spaceBetween: 10,
  };

  constructor(
    private modalController: ModalController,
    private eventsService: EventsService
  ) { }

  ngAfterViewInit() {
    if (this.swiperGalleryRefs?.nativeElement) {
      Object.assign(this.swiperGalleryRefs.nativeElement, this.swiperGalleryConfig);
      this.swiperGalleryRefs.nativeElement.initialize();
    }
  }

  loadTicketsToId() {
    this.eventsService.getTicketsToIdEventToProfile(this.event.id!).subscribe({
      next: () => {
        this.openPayTicket()
      }
    })
  }

  loadEventToId() {
    this.eventsService.getEventToId(this.event.id!).subscribe({
      next: (data) => {
        this.eventsService.setEventoCompleto(data);
        this.openProfileEvent();
      }
    })
  }

  async openProfileEvent() {
    const modal = await this.modalController.create({
      component: EventProfileComponent,
      componentProps: { create: false, stats: false }
    });
    modal.present();
  }

  async openPayTicket() {
    const modal = await this.modalController.create({
      component: PayTicketComponent,
      cssClass: ['radius-modals', 'modal-60vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });
    modal.present();
  }

  onImageLoad() {
    this.isLoading = false;
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/events/custom-icons/noimage.svg'; // Imagen de fallback
    this.isLoading = false;
  }


}
