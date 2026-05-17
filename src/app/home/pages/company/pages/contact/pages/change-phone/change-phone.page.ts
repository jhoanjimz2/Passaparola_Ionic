import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, switchMap } from 'rxjs';

import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { Company } from 'src/app/shared/interfaces/company/company.interface';
import { Country } from 'src/app/shared/interfaces/country/country.interface';
import { SmsSendCodeRequest } from 'src/app/shared/interfaces/sms-code/request/sms-send-code-request.interface';
import {
  CompanyService,
  CountryService,
  SmsCodeService,
} from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-change-phone',
  templateUrl: './change-phone.page.html',
  styleUrls: ['./change-phone.page.scss'],
})
export class ChangePhonePage implements OnInit, OnDestroy {
  company: Company = {} as Company;
  formContact: FormGroup = {} as FormGroup;
  formCode: FormGroup = {} as FormGroup;
  countries: Country[] = [];

  smsSendCodeRequest: SmsSendCodeRequest = {} as SmsSendCodeRequest;
  smsCodeId: string = '';
  minutes: number = 2;
  seconds: number = 0;
  duration: number = 60;
  timer: number = 60;
  percent = 0;
  timeCheck: any;

  @ViewChild('code1', { static: false }) code1: ElementRef | undefined;
  @ViewChild('code2', { static: false }) code2: ElementRef | undefined;
  @ViewChild('code3', { static: false }) code3: ElementRef | undefined;
  @ViewChild('code4', { static: false }) code4: ElementRef | undefined;
  @ViewChild('code5', { static: false }) code5: ElementRef | undefined;
  @ViewChild('code6', { static: false }) code6: ElementRef | undefined;

  changePhoneSuccess = false;

  smsCodeSuscription: Subscription | undefined;
  smsCodeRead = false;

  constructor(
    private formBuild: FormBuilder,
    private countryService: CountryService,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private smsCodeService: SmsCodeService,
    private translate: TranslateService,
    private companyService: CompanyService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.company = this.authenticationService.user;
    this.buildFormContact();
    this.buildFormCode();
    this.getCountries();

    this.route.queryParams.subscribe((params: any) => {
      const phone: any = params.phone ? JSON.parse(params.phone) : '';
      if (phone) {
        this.formContact.controls['idCountry'].setValue(phone.idCountry);
        this.formContact.controls['phone'].setValue(phone.phone);
        return;
      }
      this.formContact.controls['idCountry'].setValue(this.company.country?.id);
      this.formContact.controls['phone'].setValue(this.company.phoneNumber!);
    });

    this.smsCodeService.smsCodeSet(null);
    this.smsCodeSuscription = this.smsCodeService.smsCodeWatch().subscribe({
      next: (smsCode) => {
        if (smsCode) {
          this.smsCodeRead = true;
          this.setCode(smsCode);
        }
      },
    });
  }

  ngOnDestroy() {
    this.smsCodeService.smsCodeSet(null);
    this.smsCodeSuscription?.unsubscribe();
  }

  buildFormContact() {
    this.formContact = this.formBuild.group({
      idCountry: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
    });
  }

  buildFormCode() {
    this.formCode = this.formBuild.group({
      code1: new FormControl('', [Validators.required]),
      code2: new FormControl('', [Validators.required]),
      code3: new FormControl('', [Validators.required]),
      code4: new FormControl('', [Validators.required]),
      code5: new FormControl('', [Validators.required]),
      code6: new FormControl('', [Validators.required]),
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

  checkCode() {
    const code = `${this.formCode.controls['code1'].value}${this.formCode.controls['code2'].value}${this.formCode.controls['code3'].value}${this.formCode.controls['code4'].value}${this.formCode.controls['code5'].value}${this.formCode.controls['code6'].value}`;
    this.smsCodeService
      .checkCode(code, this.smsCodeId)
      .pipe(
        switchMap(() => {
          const company: Company = {
            id: this.company.id,
            phoneNumber: this.formContact.controls['phone'].value,
          };
          return this.companyService.updateCompany(company);
        })
      )
      .subscribe({
        next: (userResponse) => {
          this.company.phoneNumber = userResponse.phoneNumber;
          this.company.country = userResponse.country;
          this.authenticationService.myUserSet(this.company);
          this.changePhoneSuccess = true;
        },
        error: (error) => console.error({ error }),
        complete: () => {},
      });
  }

  inputCode(nroInput: number) {
    if (nroInput == 1 && this.formCode.controls['code1'].value)
      this.code2!.nativeElement.focus();

    if (nroInput == 2 && this.formCode.controls['code2'].value)
      this.code3!.nativeElement.focus();

    if (nroInput == 3 && this.formCode.controls['code3'].value)
      this.code4!.nativeElement.focus();

    if (nroInput == 4 && this.formCode.controls['code4'].value)
      this.code5!.nativeElement.focus();

    if (nroInput == 5 && this.formCode.controls['code5'].value)
      this.code6!.nativeElement.focus();
  }

  getCode() {
    const countryInfo = this.countries.find(
      (country) => country.id === this.formContact.controls['idCountry'].value
    );
    this.smsSendCodeRequest = {
      from: environment.appName,
      to: `${countryInfo?.phonePrefix}${this.formContact.controls['phone'].value}`,
      text: this.translate.instant('GENERAL.VERIFICATION_CODE'),
      languageCode: localStorage.getItem('language')
        ? localStorage.getItem('language')!
        : 'it',
    };
    this.smsCodeService.sendSms(this.smsSendCodeRequest).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.spinner.show();
        }, 100);
        this.cleanTime();
        this.smsCodeId = response.entity.id;
        this.timeCheckCode();
        setTimeout(() => {
          if (!this.smsCodeRead) {
            this.code1!.nativeElement.focus();
          }
          this.spinner.hide();
        }, 8000);
      },
    });
  }

  timeCheckCode() {
    this.timeCheck = setInterval(() => {
      this.minutes = Math.floor(this.timer / 60);
      this.seconds = this.timer % 60;
      this.minutes = this.minutes < 10 ? 0 + this.minutes : this.minutes;
      this.seconds = this.seconds < 10 ? 0 + this.seconds : this.seconds;
      this.percent = 100 - (this.timer * 100) / this.duration;
      if (--this.timer < 0) {
        clearInterval(this.timeCheck);
      }
    }, 1000);
  }

  cleanTime() {
    clearInterval(this.timeCheck);
    this.percent = 0;
    this.minutes = 2;
    this.seconds = 0;
    this.duration = 60;
    this.timer = 60;
  }

  async setCode(code: string) {
    this.formCode.controls['code1'].setValue(code[0]);
    this.formCode.controls['code2'].setValue(code[1]);
    this.formCode.controls['code3'].setValue(code[2]);
    this.formCode.controls['code4'].setValue(code[3]);
    this.formCode.controls['code5'].setValue(code[4]);
    this.formCode.controls['code6'].setValue(code[5]);

    this.spinner.hide();
  }
}
