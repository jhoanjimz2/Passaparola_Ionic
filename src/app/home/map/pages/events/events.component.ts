import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
})
export class EventsComponent implements OnInit, AfterViewInit {
  @ViewChild('my_swiper')
  swiperContainerRef!: ElementRef<SwiperContainer>;

  @ViewChild(HeaderComponent, { static: false })
  header!: HeaderComponent;

  event_demo: any[] = [
    {
      title: 'Stanco della routine?',
      subtitle: 'Scopri gli eventi',
      content:
        'Concerti, eventi, feste private, spettacoli, sagre e tanto divertimento',
    },
    {
      title: 'Più sei connesso',
      subtitle: 'Più ti diverti',
      content:
        'Esplora i gruppi di Passaparola, persone vicino a te con i tuoi stessi gusti',
    },
    {
      title: "Prenota con l'app",
      subtitle: 'Invita chi vuoi',
      content:
        'Scegli il tuo evento, condividilo con chi ti fa piacere o cerca con chi andare',
    },
    {
      title: 'Disponibile dal',
      subtitle: '09 febbraio',
      content:
        'La sezione dedicata a Gruppi ed Eventi sarò on line dal 09 febbraio 2025',
    },
  ];

  event_demo_selected = this.event_demo[0];

  days: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  targetDate: Date = new Date('2025-02-09T00:00:00');

  textButton = 'Prossimo';

  swiperConfig: SwiperOptions = {
    pagination: true,
  };

  constructor() {}

  ngOnInit() {
    this.startCountdown();
  }

  ngAfterViewInit(): void {
    Object.assign(this.swiperContainerRef.nativeElement, this.swiperConfig);

    this.swiperContainerRef.nativeElement.initialize();
  }

  startCountdown() {
    setInterval(() => {
      const now = new Date().getTime();
      const distance = this.targetDate.getTime() - now;

      this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    }, 1000);
  }

  swiperNext(swiperContainer: SwiperContainer) {
    if (swiperContainer.swiper.activeIndex === 3) {
      this.header.back();
    } else {
      swiperContainer.swiper.slideNext();
    }
  }

  swiperPrev(swiperContainer: SwiperContainer) {
    swiperContainer.swiper.slidePrev();
  }

  onSlideChange(swiperContainer: any) {
    const index: number = swiperContainer.target.swiper.activeIndex;

    this.event_demo_selected = this.event_demo[index];

    if (index === 3) {
      this.textButton = 'Chiudi';
    }
  }
}
