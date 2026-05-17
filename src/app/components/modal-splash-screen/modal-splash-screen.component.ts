import { Component, ElementRef, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ShowSpinnerService } from 'src/app/shared/services';
import { InitialOnBoardingComponent } from '../initial-on-boarding/initial-on-boarding.component';

@Component({
  selector: 'app-modal-splash-screen',
  templateUrl: './modal-splash-screen.component.html',
  styleUrls: ['./modal-splash-screen.component.scss'],
})
export class ModalSplashScreenComponent implements OnInit {
  loading = true;
  buffer = 0;
  progress = 0;
  indexProgressBar = 0;
  slideText = [
    'SPLASH_SCREEN.TEXT_1',
    'SPLASH_SCREEN.TEXT_2',
    'SPLASH_SCREEN.TEXT_3',
    'SPLASH_SCREEN.TEXT_4',
    'SPLASH_SCREEN.TEXT_5',
    'SPLASH_SCREEN.TEXT_6',
    'SPLASH_SCREEN.TEXT_7',
    'SPLASH_SCREEN.TEXT_8',
    'SPLASH_SCREEN.TEXT_9',
    'SPLASH_SCREEN.TEXT_10',
    'SPLASH_SCREEN.TEXT_11',
    'SPLASH_SCREEN.TEXT_12',
  ];

  constructor(
    private elementRef: ElementRef,
    private modalController: ModalController,
    private showSpinnerService: ShowSpinnerService
  ) {}

  ngOnInit() {
    this.slideText = this.shuffleArray(this.slideText);
    this.checkBackgroudImg();
  }

  checkBackgroudImg() {
    const divBackground =
      this.elementRef.nativeElement.querySelector('.main-background');
    const imgUrl = getComputedStyle(divBackground).backgroundImage.replace(
      /url\((['"])?(.*?)\1\)/gi,
      '$2'
    );
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      this.loading = false;
      this.closeModal();
    };
  }

  closeModal() {
    setTimeout(() => {
      this.modalController.dismiss();
      this.showSpinnerService.showSpinnerWatchSet(true);
      this.checkWelcomeStatus();
    }, 1000);
  }

  shuffleArray(array: string[]): string[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  async checkWelcomeStatus() {
    const welcome = localStorage.getItem('passaparola_welcome');
    if (!welcome) {
      const modal = await this.modalController.create({
        component: InitialOnBoardingComponent,
        cssClass: 'modal-full-screen',
        backdropDismiss: false,
      });
      await modal.present();
      localStorage.setItem('passaparola_welcome', 'true');
    }
  }
}
