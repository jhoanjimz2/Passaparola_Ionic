import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  viewInfo = false;
  infoApp = [
    {
      info: `LANDING.INFO_1`,
      image: 'assets/images/landing/image-background-1.png',
      button: false,
    },
    {
      info: `LANDING.INFO_2`,
      image: 'assets/images/landing/image-background-2.png',
      button: false,
    },
    {
      info: `LANDING.INFO_3`,
      image: 'assets/images/landing/image-background-3.png',
      button: true,
    },
  ];
  information: any;
  step = 0;
  time: any;

  constructor(private navController: NavController) {
    localStorage.setItem('appPassaparola_landing', 'true');
  }

  ngOnInit() {
    this.information = this.infoApp[this.step];
  }

  showInfoApp() {
    this.viewInfo = true;
    this.time = setInterval(() => {
      this.setInformation();
    }, 4000);
  }

  setInformation() {
    this.step++;
    this.information = this.infoApp[this.step];
    if (this.step === 2) clearInterval(this.time);
  }

  singUp() {
    this.navController.navigateRoot(['sing-up']);
  }
}
