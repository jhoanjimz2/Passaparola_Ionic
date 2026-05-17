import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-information',
  templateUrl: './information.page.html',
  styleUrls: ['./information.page.scss'],
})
export class InformationPage implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToRegiter() {
    this.navController.navigateForward(['pages/help-earn/register']);
  }
}
