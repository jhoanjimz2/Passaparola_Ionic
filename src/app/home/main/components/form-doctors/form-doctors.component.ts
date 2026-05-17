import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

import { Country } from 'src/app/shared/interfaces/country/country.interface';
import { EmailSendCodeRequest } from 'src/app/shared/interfaces/email-code/request/email-send-code-request.interface';
import { CountryService, EmailCodeService } from 'src/app/shared/services';

@Component({
  selector: 'app-form-doctors',
  templateUrl: './form-doctors.component.html',
  styleUrls: ['./form-doctors.component.scss'],
})
export class FormDoctorsComponent implements OnInit {
  img = 'assets/images/doctors.png';
  countries: Country[] = [];
  codeCountry = '';
  formInfo: FormGroup = {} as FormGroup;
  codePhone = '';
  phone = '';

  constructor(
    private formBuild: FormBuilder,
    private countryService: CountryService,
    private emailCodeService: EmailCodeService,
    private modalController: ModalController,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.getCountries();
    this.buildFormInfo();
  }

  buildFormInfo() {
    this.formInfo = this.formBuild.group({
      phonePrefix: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      terms: new FormControl(false, [Validators.required]),
    });
  }

  getCountries() {
    this.countryService.findAll().subscribe({
      next: (response) => {
        this.countries = response;
        if (this.codePhone || this.phone) this.getCountryCode(this.codePhone);
      },
      error: (error) => console.error(error),
      complete: () => {},
    });
  }

  getCountryCode(prefix: string) {
    const contry = this.countries.find((data) => data.phonePrefix === prefix);
    this.codeCountry = contry ? contry.code : '';
  }

  save() {
    const htmlContent = ` 
    <ol>
      <li><b>${this.translate.instant(
        'COMPONENTS.MODAL_FORM_DOCTORS.FOR_EMAIL.NAME'
      )}:</b> ${this.formInfo.controls['name'].value}</li>
      <li><b>${this.translate.instant(
        'COMPONENTS.MODAL_FORM_DOCTORS.PHONE'
      )}:</b> ${this.formInfo.controls['phonePrefix'].value}${
      this.formInfo.controls['phone'].value
    }</li>
      <li><b>${this.translate.instant(
        'COMPONENTS.MODAL_FORM_DOCTORS.FOR_EMAIL.EMAIL'
      )}:</b> ${this.formInfo.controls['email'].value}</li>
    </ol>`;
    const mailReq: EmailSendCodeRequest = {
      subject: `${this.translate.instant(
        'COMPONENTS.MODAL_FORM_DOCTORS.FOR_EMAIL.REQUETS'
      )} Passaparola - ${this.translate.instant(
        'COMPONENTS.MODAL_FORM_DOCTORS.FOR_EMAIL.DOCTOR'
      )}`,
      to: [
        {
          name: `${this.translate.instant(
            'COMPONENTS.MODAL_FORM_DOCTORS.FOR_EMAIL.ADMIN'
          )} Passaparola`,
          email: 'flaviovirginiotrifoni@gmail.com',
        },
      ],
      htmlContent: `<html>
      <head></head>
      <style>
        ol {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
      </style>
      <body>${htmlContent}</body>
      </html>`,
    };

    this.emailCodeService.sendEmail(mailReq).subscribe({
      next: () => {
        this.toastr.success(
          this.translate.instant(
            'COMPONENTS.MODAL_FORM_DOCTORS.FOR_EMAIL.INFO_SEND'
          )
        );
        this.modalController.dismiss();
      },
    });
  }
}
