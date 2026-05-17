import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header-auth',
  templateUrl: './header-auth.component.html',
  styleUrls: ['./header-auth.component.scss'],
})
export class HeaderAuthComponent implements OnInit {
  @Input() backIcon = false;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  backToLogin() {
    this.navController.navigateBack(['login']);
  }
}
