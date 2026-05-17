import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavController }           from '@ionic/angular';

import { Subscription, switchMap } from 'rxjs';
import { TranslateService }        from '@ngx-translate/core';
import { NgxSpinnerService }       from 'ngx-spinner';

import { Country }                 from 'src/app/shared/interfaces/country/country.interface';
import { SmsSendCodeRequest }      from 'src/app/shared/interfaces/sms-code/request/sms-send-code-request.interface';
import {
  CommunityService,
  PlatformService,
  SmsCodeService,
  WalletService,
} from 'src/app/shared/services';
import { CountryService }          from 'src/app/shared/services/country.service';
import { UserService }             from 'src/app/shared/services/user.service';
import { environment }             from 'src/environments/environment';
import { User }                    from '../../../../shared/interfaces/user/user.interface';

@Component({
  selector: 'app-check-phone',
  templateUrl: './check-phone.component.html',
  styleUrls: ['./check-phone.component.scss'],
})
export class CheckPhoneComponent implements OnInit, OnDestroy {
  countries: Country[] = [];
  formRegister: FormGroup = {} as FormGroup;
  formCode: FormGroup = {} as FormGroup;
  smsSendCodeRequest: SmsSendCodeRequest = {} as SmsSendCodeRequest;
  smsCodeId: string = '';
  minutes: number = 2;
  seconds: number = 0;
  duration: number = 60;
  timer: number = 60;
  percent = 0;
  @Input() user: User = {} as User;
  timeCheck: any;
  idCountry: string = '';
  @Output() userEmit: EventEmitter<User> = new EventEmitter<User>();

  @ViewChild('code1', { static: false }) code1: ElementRef | undefined;
  // @ViewChild('code2', { static: false }) code2: ElementRef | undefined;
  // @ViewChild('code3', { static: false }) code3: ElementRef | undefined;
  // @ViewChild('code4', { static: false }) code4: ElementRef | undefined;
  // @ViewChild('code5', { static: false }) code5: ElementRef | undefined;
  // @ViewChild('code6', { static: false }) code6: ElementRef | undefined;

  @Input() codeCountry = '';
  @Input() phone = '';
  @Input() phonePrefix = '';

  smsCodeSuscription: Subscription | undefined;
  smsCodeRead = false;

  constructor(
    private countryService: CountryService,
    private formBuild: FormBuilder,
    private smsCodeService: SmsCodeService,
    private userService: UserService,
    private navController: NavController,
    private translate: TranslateService,
    private walletService: WalletService,
    private communityService: CommunityService,
    private spinner: NgxSpinnerService,
    private platformService: PlatformService
  ) {}

  ngOnInit() {
    this.buildFormRegister();
    this.buildFormCode();
    this.getCountries();

    if (this.phone && this.phonePrefix && this.codeCountry) {
      this.checkPhone();
    }

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

  buildFormRegister() {
    this.formRegister = this.formBuild.group({
      phonePrefix: new FormControl(this.phonePrefix ?? '', [
        Validators.required,
      ]),
      phone: new FormControl(this.phone ?? '', [Validators.required]),
      code: new FormControl('', []),
    });
  }

  buildFormCode() {
    this.formCode = this.formBuild.group({
      code1: new FormControl('', [Validators.required]),
      // code2: new FormControl('', [Validators.required]),
      // code3: new FormControl('', [Validators.required]),
      // code4: new FormControl('', [Validators.required]),
      // code5: new FormControl('', [Validators.required]),
      // code6: new FormControl('', [Validators.required]),
    });
  }

  getCountries() {
    this.countryService.findAll().subscribe({
      next: (respose) => {
        this.countries = respose;
        if (this.phonePrefix) {
          this.getIdCountry(this.phonePrefix);
        }
      },
      complete: () => {},
    });
  }

  checkPhone() {
    this.userService
      .getUserByPhone(
        this.formRegister.controls['phonePrefix'].value,
        this.formRegister.controls['phone'].value
      )
      .subscribe({
        next: (response) => {
          if (!response) return this.getCode();
          this.user = response;
          if (this.user.pinActive) {
            // localStorage.setItem(
            //   'appPassaparola_user',
            //   JSON.stringify(this.user)
            // );
            // const code =
            //   this.formRegister.controls['phonePrefix'].value.substring(1);
            // const url = `${environment.urlPWA}/login?code=${code}&phone=${this.formRegister.controls['phone'].value}`;
            // const a = document.createElement('a');
            // a.setAttribute('href', url);
            // a.setAttribute('target', '');
            // a.click();
            this.navController.navigateRoot(['login'], {
              queryParams: {
                code: this.formRegister.controls['phonePrefix'].value.substring(
                  1
                ),
                phone: this.formRegister.controls['phone'].value,
                phoneIsChecked: true,
                userAvailable: true,
              },
            });

            return;
          }
          this.userEmit.emit(this.user);
        },
      });
  }

  getCode() {
    this.smsSendCodeRequest = {
      from: environment.appName,
      to: `${this.formRegister.controls['phonePrefix'].value}${this.formRegister.controls['phone'].value}`,
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
          this.code1!.nativeElement.focus();
          this.spinner.hide();
        }, 2000);
      },
    });
  }

  checkCode() {
    // const code = `${this.formCode.controls['code1'].value}${this.formCode.controls['code2'].value}${this.formCode.controls['code3'].value}${this.formCode.controls['code4'].value}${this.formCode.controls['code5'].value}${this.formCode.controls['code6'].value}`;
    const code = `${this.formCode.controls['code1'].value}`;
    this.smsCodeService
      .checkCode(code, this.smsCodeId)
      .pipe(
        switchMap(() => {
          const user: User = {
            phoneNumber: this.formRegister.controls['phone'].value,
            countryID: this.idCountry,
            rol: 'user',
            promoCode: this.user.promoCode,
          };
          return this.userService.createUser(user);
        })
      )
      .pipe(
        switchMap((userResponse) => {
          this.user = userResponse;
          return this.walletService.createWallet({
            userId: userResponse.userID!,
            status: true,
            countryCode: this.user.country?.code,
          });
        })
      )
      .pipe(
        switchMap(() => {
          return this.communityService.createCommunity({
            status: true,
            level: 1,
            countryCode: this.user.country?.code!,
            userId: this.user.userID!,
            promoCode: this.user.promoCode,
          });
        })
      )
      .subscribe({
        next: () => {
          this.userEmit.emit(this.user);
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
        // this.timer = this.duration;
      }
    }, 1000);
  }

  getIdCountry(prefix: string) {
    const contry = this.countries.find((data) => data.phonePrefix === prefix);
    this.idCountry = contry ? contry.id : '';
    this.codeCountry = contry ? contry.code : '';
  }

  inputCode(nroInput: number) {
    // if (nroInput == 1 && this.formCode.controls['code1'].value)
    //   this.code2!.nativeElement.focus();
    // if (nroInput == 2 && this.formCode.controls['code2'].value)
    //   this.code3!.nativeElement.focus();
    // if (nroInput == 3 && this.formCode.controls['code3'].value)
    //   this.code4!.nativeElement.focus();
    // if (nroInput == 4 && this.formCode.controls['code4'].value)
    //   this.code5!.nativeElement.focus();
    // if (nroInput == 5 && this.formCode.controls['code5'].value)
    //   this.code6!.nativeElement.focus();
  }

  cleanTime() {
    clearInterval(this.timeCheck);
    this.percent = 0;
    this.minutes = 2;
    this.seconds = 0;
    this.duration = 60;
    this.timer = 60;
  }

  cleanInput(index: 'code1' | 'code2' | 'code3' | 'code4' | 'code5' | 'code6') {
    // switch (index) {
    //   case 'code1':
    //     this.formCode.controls[index].setValue(null);
    //     return;
    //   case 'code2':
    //     this.formCode.controls[index].setValue(null);
    //     return;
    //   case 'code3':
    //     this.formCode.controls[index].setValue(null);
    //     return;
    //   case 'code4':
    //     this.formCode.controls[index].setValue(null);
    //     return;
    //   case 'code5':
    //     this.formCode.controls[index].setValue(null);
    //     return;
    //   case 'code6':
    //     this.formCode.controls[index].setValue(null);
    //     return;
    //   default:
    //     return;
    // }
  }

  async setCode(code: string) {
    this.formCode.controls['code1'].setValue(code);
    // this.formCode.controls['code2'].setValue(code[1]);
    // this.formCode.controls['code3'].setValue(code[2]);
    // this.formCode.controls['code4'].setValue(code[3]);
    // this.formCode.controls['code5'].setValue(code[4]);
    // this.formCode.controls['code6'].setValue(code[5]);

    this.spinner.hide();
  }

  onOtpInput(event: any) {
    const value = event.data;
    if (value?.length === 6) {
      this.setCode(value);
    }
  }
}
