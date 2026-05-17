import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
})
export class InformationComponent implements OnInit {
  @Input() information: any;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  singUp() {
    this.navController.navigateRoot(['sing-up']);
  }
}
