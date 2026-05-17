import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavController } from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { Country } from 'src/app/shared/interfaces/country/country.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { CountryService, UserService } from 'src/app/shared/services';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  user: User = {} as User;
  countries: Country[] = [];
  formContact: FormGroup = {} as FormGroup;

  constructor(
    private formBuild: FormBuilder,
    private countryService: CountryService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.user = this.authenticationService.user;
    this.buildFormContact();
    this.getCountries();
    this.getUser();
  }

  ionViewDidEnter() {
    this.getUser();
  }

  buildFormContact() {
    this.formContact = this.formBuild.group({
      idCountry: new FormControl(
        this.user.country?.id ? this.user.country?.id : '',
        [Validators.required]
      ),
      phone: new FormControl(
        this.user.phoneNumber ? this.user.phoneNumber : '',
        [Validators.required]
      ),
      email: new FormControl(this.user.email ? this.user.email : '', [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  getCountries() {
    this.countryService.findAll().subscribe({
      next: (response) => {
        this.countries = response;
      },
      error: (error) => console.error(error),
      complete: () => {},
    });
  }

  getUser() {
    this.userService.getUserById(this.user.id!).subscribe({
      next: (response) => {
        this.user = response;
        this.buildFormContact();
      },
    });
  }

  updateEmail() {
    const email = this.formContact.controls['email'].value;
    const user: User = {
      id: this.user.id,
      email,
      phoneNumber: this.user.phoneNumber,
      countryID: this.user.country?.id,
    };
    this.userService.updateUser(user).subscribe({
      next: (response) => {
        this.user.email = response.email;
        this.authenticationService.user = this.user;
        localStorage.setItem('appPassaparola_user', JSON.stringify(this.user));
        this.authenticationService.myUserSet(this.user);
        this.toastr.success(this.translate.instant('CONTACT.EMAIL_UPDATE'));
      },
    });
  }

  changePhone() {
    const phone = {
      idCountry: this.formContact.controls['idCountry'].value,
      phone: this.formContact.controls['phone'].value,
    };
    this.navController.navigateForward(['pages/profile/contact/change-phone'], {
      queryParams: { phone: JSON.stringify(phone) },
    });
  }
}
