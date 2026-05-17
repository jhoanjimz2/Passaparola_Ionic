import { Component, Input, OnInit }       from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';

import { NgxSpinnerService }              from 'ngx-spinner';
import { ToastrService }                  from 'ngx-toastr';

import { AuthenticationService }          from 'src/app/core/service/authentication.service';
import { Company }                        from 'src/app/shared/interfaces/company/company.interface';
import { ProfileCompany }                 from 'src/app/shared/interfaces/company/profile-company.interface';
import { Profile }                        from 'src/app/shared/interfaces/user/profile.interface';
import { User }                           from 'src/app/shared/interfaces/user/user.interface';
import { CompanyService, UserService }    from 'src/app/shared/services';

@Component({
  selector: 'app-modal-info-profile',
  templateUrl: './modal-info-profile.component.html',
  styleUrls: ['./modal-info-profile.component.scss'],
})
export class ModalInfoProfileComponent implements OnInit {
  formIdentity: FormGroup = {} as FormGroup;
  user: User | Company | any | undefined;
  profile: Profile | ProfileCompany | any | undefined;
  disabledForm = true;
  @Input() isLoginCompany = false;

  constructor(
    private formBuild: FormBuilder,
    private userService: UserService,
    private companyService: CompanyService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authenticationService: AuthenticationService,
    private modalController: ModalController,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.buildFormIdentity();
  }

  buildFormIdentity() {
    this.formIdentity = this.formBuild.group({
      name: new FormControl(this.profile?.name, [Validators.required]),
      lastName: new FormControl(this.profile?.lastName, []),
      username: new FormControl(this.profile?.username, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9_]+$/),
      ]),
    });
  }

  async updateInfo() {
    this.spinner.show();
    this.profile = {
      id: this.profile.id,
      name: this.formIdentity.controls['name'].value,
      lastName: this.formIdentity.controls['lastName'].value,
      username: this.formIdentity.controls['username'].value,
    };

    if (!this.isLoginCompany) {
      this.userService
        .updateProfile({ ...this.profile, id: this.profile.id })
        .subscribe({
          next: (response) => {
            this.profile = response;
            this.user.profile = this.user.profile = response;
            this.authenticationService.user = {
              ...this.user,
            };
            localStorage.setItem(
              'appPassaparola_user',
              JSON.stringify(this.user)
            );
            localStorage.setItem('appPassaparola_onboarding', 'true');
            this.authenticationService.myUserSet(this.user);
            this.modalController.dismiss();
            this.navController.navigateRoot(['main']);
          },
        });
    }

    if (this.isLoginCompany) {
      delete this.profile.lastName;
      this.companyService
        .updateCompanyProfile({ ...this.profile, id: this.profile.id })
        .subscribe({
          next: (response) => {
            this.profile = response;
            this.user.profile = this.user.profile = response;
            this.authenticationService.user = {
              ...this.user,
            };
            localStorage.setItem(
              'appPassaparola_user',
              JSON.stringify(this.user)
            );
            localStorage.setItem('appPassaparola_onboarding', 'true');
            this.authenticationService.myUserSet(this.user);
            this.modalController.dismiss();
            this.navController.navigateRoot(['main']);
          },
        });
    }
  }
}
