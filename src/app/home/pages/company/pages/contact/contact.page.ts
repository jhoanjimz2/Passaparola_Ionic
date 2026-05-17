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
import { Company } from 'src/app/shared/interfaces/company/company.interface';
import { Country } from 'src/app/shared/interfaces/country/country.interface';
import { CompanyService, CountryService } from 'src/app/shared/services';

@Component({
  selector: 'app-seat-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  company: Company = {} as Company;
  countries: Country[] = [];
  formContact: FormGroup = {} as FormGroup;

  constructor(
    private formBuild: FormBuilder,
    private countryService: CountryService,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private navController: NavController,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.company = this.authenticationService.user;
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
        this.company.country?.id ? this.company.country?.id : '',
        [Validators.required]
      ),
      phone: new FormControl(
        this.company.phoneNumber ? this.company.phoneNumber : '',
        [Validators.required]
      ),
      email: new FormControl(this.company.email ? this.company.email : '', [
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
    this.companyService.getCompanyById(this.company.id!).subscribe({
      next: (response) => {
        this.company = response;
        this.buildFormContact();
      },
    });
  }

  updateEmail() {
    const email = this.formContact.controls['email'].value;
    const company: Company = {
      id: this.company.id,
      email,
      phoneNumber: this.company.phoneNumber,
    };
    this.companyService.updateCompany(company).subscribe({
      next: (response) => {
        this.company.email = response.email;
        localStorage.setItem(
          'appPassaparola_user',
          JSON.stringify(this.company)
        );
        this.authenticationService.myUserSet(this.company);
        this.toastr.success(this.translate.instant('CONTACT.EMAIL_UPDATE'));
      },
    });
  }

  changePhone() {
    const phone = {
      idCountry: this.formContact.controls['idCountry'].value,
      phone: this.formContact.controls['phone'].value,
    };
    this.navController.navigateForward(['pages/company/contact/change-phone'], {
      queryParams: { phone: JSON.stringify(phone) },
    });
  }
}
