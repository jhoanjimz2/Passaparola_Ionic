import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PlatformService } from 'src/app/shared/services';

import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';

interface Slide {
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-initial-on-boarding',
  templateUrl: './initial-on-boarding.component.html',
  styleUrls: ['./initial-on-boarding.component.scss'],
})
export class InitialOnBoardingComponent implements OnInit, AfterViewInit {
  showSlide = false;
  slides: Slide[] = [
    {
      title: 'ONBOARDING_APP_USER.SLIDES.SLIDE_1.TITLE',
      description: 'ONBOARDING_APP_USER.SLIDES.SLIDE_1.DESCRIPTION',
      image: 'assets/images/initial-onboarding/img-1.jpg',
    },
    {
      title: 'ONBOARDING_APP_USER.SLIDES.SLIDE_2.TITLE',
      description: 'ONBOARDING_APP_USER.SLIDES.SLIDE_2.DESCRIPTION',
      image: 'assets/images/initial-onboarding/img-2.jpg',
    },
    {
      title: 'ONBOARDING_APP_USER.SLIDES.SLIDE_3.TITLE',
      description: 'ONBOARDING_APP_USER.SLIDES.SLIDE_3.DESCRIPTION',
      image: 'assets/images/initial-onboarding/img-3.jpg',
    },
    {
      title: 'ONBOARDING_APP_USER.SLIDES.SLIDE_4.TITLE',
      description: 'ONBOARDING_APP_USER.SLIDES.SLIDE_4.DESCRIPTION',
      image: 'assets/images/initial-onboarding/img-4.jpg',
    },
    {
      title: 'ONBOARDING_APP_USER.SLIDES.SLIDE_5.TITLE',
      description: 'ONBOARDING_APP_USER.SLIDES.SLIDE_5.DESCRIPTION',
      image: 'assets/images/initial-onboarding/img-5.jpg',
    },
    {
      title: 'ONBOARDING_APP_USER.SLIDES.SLIDE_6.TITLE',
      description: 'ONBOARDING_APP_USER.SLIDES.SLIDE_6.DESCRIPTION',
      image: 'assets/images/initial-onboarding/img-6.jpg',
    },
  ];

  @ViewChild('swiperEl')
  swiperEl!: ElementRef<SwiperContainer>;
  @ViewChild('swiperElContainer')
  swiperElContainer!: ElementRef<SwiperContainer>;
  slideIndex = 0;
  swiperConfig: SwiperOptions = {
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      bulletActiveClass: 'swiper-pagination-bullet-active',
    },
    navigation: true,
  };
  isIos = false;

  constructor(
    private modalController: ModalController,
    private platformService: PlatformService
  ) {
    this.isIos = this.platformService.isIos();
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    Object.assign(this.swiperEl.nativeElement, this.swiperConfig);
    this.swiperEl.nativeElement.initialize();
  }

  close() {
    this.modalController.dismiss();
  }

  showSlideCard() {
    this.showSlide = true;
    this.swiperEl.nativeElement.hidden = false;
    // this.swiperElContainer.nativeElement.hidden = false;
  }

  nextSlide(swiperContainer: SwiperContainer) {
    swiperContainer?.swiper.slideNext();
  }

  swiperPrev(swiperContainer: SwiperContainer) {
    swiperContainer.swiper.slidePrev();
  }

  onSlideChange(swiperContainer: any) {
    const index: number = swiperContainer.target.swiper.activeIndex;
    this.slideIndex = index;
  }
}
