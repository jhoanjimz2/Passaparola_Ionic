import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';

interface ProfesionalDemo {
  title: string;
  subtitle: string;
  content: string;
}

@Component({
  selector: 'app-profesionals-page',
  templateUrl: './profesionals.component.html',
  styleUrls: ['./profesionals.component.scss'],
})
export class ProfesionalsPageComponent implements OnInit, AfterViewInit {
  @ViewChild('my_swiper')
  swiperContainerRef!: ElementRef<SwiperContainer>;

  @ViewChild(HeaderComponent, { static: false })
  header!: HeaderComponent;

  items: string[] = [];

  textButton = 'Prossimo';

  profesionals_demo: ProfesionalDemo[] = [
    {
      title: 'Trova professionisti',
      subtitle: 'vicini a te',
      content:
        'Idraulici, elettricisti, muratori, giardinieri e ogni professionista che ti serve',
    },
    {
      title: 'Solo professionisti',
      subtitle: 'suggeriti da voi',
      content:
        'Su Passaparola trovi solo professionisti selezionati al giusto prezzo',
    },
    {
      title: "Paga con l'app",
      subtitle: 'facile e veloce',
      content: 'Ricevi cashback e Punti Ricompensa per ogni tua spesa',
    },
    {
      title: 'Disponibile il',
      subtitle: '30 Novembre',
      content:
        'La sezione dedicata ai professionisti verrà lanciata IL 30 Novembre 2024',
    },
  ];

  profesional_demo_selected = this.profesionals_demo[0];

  swiperConfig: SwiperOptions = {
    pagination: true,
  };

  constructor() {}

  ngOnInit() {
    this.generateItems();
  }

  ngAfterViewInit(): void {
    Object.assign(this.swiperContainerRef.nativeElement, this.swiperConfig);

    this.swiperContainerRef.nativeElement.initialize();
  }

  private generateItems() {
    const count = this.items.length + 1;
    for (let i = 0; i < 50; i++) {
      this.items.push(`Item ${count + i}`);
    }
  }

  onIonInfinite(ev: any) {
    this.generateItems();

    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
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
    const index = swiperContainer.target.swiper.activeIndex;

    this.profesional_demo_selected = this.profesionals_demo[index];

    if (index === 3) {
      this.textButton = 'Chiudi';
    }
  }
}
