import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from 'src/app/shared/interfaces/company/company.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';

@Component({
  selector: 'app-change-pin',
  templateUrl: './change-pin.page.html',
  styleUrls: ['./change-pin.page.scss'],
})
export class ChangePinPage implements OnInit {
  user: User = {} as User;
  company: Company = {} as Company;
  pinChange: 'user' | 'company' | '' = '';
  changePinSuccess = false;
  phone = '';
  phonePrefix = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // this.user.id = '5521e37e-51ff-487a-abaa-ba477da0ba76';
    // this.user.userID = 'ES00000000000001';
    // this.changePinSuccess = true;

    this.route.queryParams.subscribe(async (params: any) => {
      this.phone = params.phone;
      this.phonePrefix = params.phonePrefix;
    });
  }

  getUser(ev: User) {
    this.user = ev;
  }

  getCompany(ev: Company) {
    this.company = ev;
  }

  getPinchange(ev: 'user' | 'company' | '') {
    this.pinChange = ev;
  }

  getChangePinSuccess(ev: boolean) {
    this.changePinSuccess = ev;
  }
}
