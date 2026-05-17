import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-change-pin-success',
  templateUrl: './change-pin-success.component.html',
  styleUrls: ['./change-pin-success.component.scss'],
})
export class ChangePinSuccessComponent implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  backToLogin() {
    this.navController.navigateBack(['login']);
  }
}
