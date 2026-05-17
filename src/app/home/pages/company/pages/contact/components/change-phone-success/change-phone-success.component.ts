import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-change-phone-success',
  templateUrl: './change-phone-success.component.html',
  styleUrls: ['./change-phone-success.component.scss'],
})
export class ChangePhoneSuccessComponent implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  backToProfile() {
    this.navController.navigateBack(['pages/company/contact']);
  }
}
