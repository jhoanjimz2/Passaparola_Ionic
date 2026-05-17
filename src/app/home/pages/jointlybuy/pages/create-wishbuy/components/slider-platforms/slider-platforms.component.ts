import { CommonModule }                                             from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-slider-platforms',
  templateUrl: './slider-platforms.component.html',
  styleUrls: ['./slider-platforms.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SliderPlatformsComponent {
  @ViewChild('swiperContainerPlatform') swiperContainerPlatform?: ElementRef;

  platforms: any[] = [
    {
      image: 'assets/images/jointlybuy/create/alibaba.png',
      text: 'Alibaba',
      url: 'https://www.alibaba.com/'
    },
    {
      image: 'assets/images/jointlybuy/create/made-in-china.png',
      text: 'Made in China',
      url: 'https://www.made-in-china.com/'
    },
    {
      image: 'assets/images/jointlybuy/create/dh-gate.png',
      text: 'DH Gate',
      url: 'https://www.dhgate.com/'
    },
    {
      image: 'assets/images/jointlybuy/create/toy-baba.png',
      text: 'Toy Baba',
      url: 'https://www.toybaba.com/'
    },
    {
      image: 'assets/images/jointlybuy/create/altro.png',
      text: 'Altro'
      // este NO tiene url, así que abrirá Google
    }
  ];


  ngAfterViewInit() {
    if (this.swiperContainerPlatform) {
      const swiperEl = this.swiperContainerPlatform.nativeElement;
      Object.assign(swiperEl, {
        slidesPerView: 'auto',
        spaceBetween: 16,
        freeMode: true,
      });
      swiperEl.initialize();
    }
  }

  openPlatform(platform: any) {
    const url = platform?.url ? platform.url : 'https://www.google.com';
    window.open(url, '_blank');
  }


}
