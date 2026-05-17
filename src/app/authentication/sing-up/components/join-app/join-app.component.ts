import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { User } from 'src/app/shared/interfaces/user/user.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-join-app',
  templateUrl: './join-app.component.html',
  styleUrls: ['./join-app.component.scss'],
})
export class JoinAppComponent implements OnInit {
  @Input() user: User = {} as User;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToApp() {
    window.open(environment.joinAppLink, '_blank');
  }

  goToLogin() {
    localStorage.setItem('appPassaparola_start', 'true');
    this.navController.navigateRoot(['login']);

    const code = this.user.country?.phonePrefix.substring(1);
    const phone = this.user.phoneNumber;
    let url = `${environment.urlPWA}/login`;
    if (code && phone)
      url = `${environment.urlPWA}/login?code=${code}&phone=${phone}`;

    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('target', '');
    a.click();
  }
}
