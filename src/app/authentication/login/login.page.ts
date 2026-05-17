import { App }                     from '@capacitor/app';
import {
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
import { ActivatedRoute }          from '@angular/router';
import {
  AlertController,
  ModalController,
  NavController,
  Platform,
} from '@ionic/angular';

import { Subscription, switchMap } from 'rxjs';
import { TranslateService }        from '@ngx-translate/core';
import { ToastrService }           from 'ngx-toastr';

import { User }                    from 'src/app/shared/interfaces/user/user.interface';
import { AuthenticationService }   from 'src/app/core/service/authentication.service';
import {
  CountryService,
  UserService,
  WalletService,
} from 'src/app/shared/services';
import { Country }                 from 'src/app/shared/interfaces/country/country.interface';
import { LoginRequets }            from '../../shared/interfaces/user/requets/login-requets.interface';
import { Company }                 from 'src/app/shared/interfaces/company/company.interface';

interface AccountCompany {
  title: string;
  name: string;
  info: string;
  img: string;
  id: string;
  type: 'main' | 'seat';
  prog?: number;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  countries: Country[] = [];
  codeCountry = 'IT';
  @Input() user: User | Company | any;
  formLogin: FormGroup = {} as FormGroup;
  showPassword = false;
  @Output() userEmit: EventEmitter<User> = new EventEmitter<User>();

  @ViewChild('code1', { static: false }) code1: ElementRef | undefined;
  @ViewChild('code2', { static: false }) code2: ElementRef | undefined;
  @ViewChild('code3', { static: false }) code3: ElementRef | undefined;
  @ViewChild('code4', { static: false }) code4: ElementRef | undefined;
  @ViewChild('code5', { static: false }) code5: ElementRef | undefined;

  codePhone = '';
  phone = '';
  phoneIsChecked = false;
  userAvailable = false;
  companyAvailable = false;
  isLoginCompany = false;
  company: Company = {} as Company;
  profesional: Company = {} as Company;
  accountCompany: AccountCompany = {} as AccountCompany;
  accountProfessional: AccountCompany | null = null;

  backButtonSubscribe: Subscription | undefined;
  companyLoginResponse: Company = {} as Company;

  constructor(
    private formBuild: FormBuilder,
    private authenticationService: AuthenticationService,
    private navController: NavController,
    private countryService: CountryService,
    private route: ActivatedRoute,
    private platform: Platform,
    private translate: TranslateService,
    private alertController: AlertController,
    private modalController: ModalController,
    private walletService: WalletService,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.authenticationService.basicAuth().subscribe({
      next: () => {
        this.getCountries();
      },
    });
    // this.subscribeBackButton();
    this.route.queryParams.subscribe(async (params: any) => {
      const code = params.code;
      const phone = params.phone;
      const phoneIsChecked = params.phoneIsChecked;
      const userAvailable = params.userAvailable;

      if (!code || !phone) return;

      this.codePhone = '+' + code;
      this.phone = phone;

      if (phoneIsChecked === 'true') {
        this.phoneIsChecked = true;
      }

      if (userAvailable === 'true') {
        this.userAvailable = true;
      }
    });
    this.authenticationService.loadStorage();
    this.user = this.authenticationService.user;
    this.buildFormCode();
  }

  ngOnDestroy() {
    this.backButtonSubscribe?.unsubscribe();
  }

  buildFormCode() {
    const stayConnected = localStorage.getItem('appPassaparola_stayConnected');
    const user = this.authenticationService.user;
    this.codeCountry = user.country?.code ? user.country.code : 'IT';

    const codePhone = this.codePhone
      ? this.codePhone
      : user.country?.phonePrefix;

    const phone = this.phone ? this.phone : user.phoneNumber;

    this.formLogin = this.formBuild.group({
      phonePrefix: new FormControl(codePhone ? codePhone : '+39', [
        Validators.required,
      ]),
      phone: new FormControl(phone ? phone : '', [Validators.required]),
      code1: new FormControl('', [Validators.required]),
      code2: new FormControl('', [Validators.required]),
      code3: new FormControl('', [Validators.required]),
      code4: new FormControl('', [Validators.required]),
      code5: new FormControl('', [Validators.required]),
      stayConnected: new FormControl(
        stayConnected === 'true' ? true : false,
        []
      ),
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

  loginUser() {
    if (this.formLogin.invalid) return;
    const pin = `${this.formLogin.controls['code1'].value}${this.formLogin.controls['code2'].value}${this.formLogin.controls['code3'].value}${this.formLogin.controls['code4'].value}${this.formLogin.controls['code5'].value}`;
    const dataLogin: LoginRequets = {
      pin,
      phone: this.formLogin.controls['phone'].value,
      countryCode: this.codeCountry,
    };
    this.authenticationService
      .login(dataLogin)
      .pipe(
        switchMap((loginResponse) => {
          return this.walletService.findDefaultWallet(loginResponse.userID!);
        })
      )
      .subscribe({
        next: (response) => {
          localStorage.setItem('walletSelected', JSON.stringify(response));
          localStorage.setItem(
            'appPassaparola_stayConnected',
            this.formLogin.controls['stayConnected'].value ? 'true' : 'false'
          );
          this.navController.navigateRoot(['social']);
        },
      });
    // this.authenticationService.login(dataLogin).subscribe({
    //   next: () => {
    //     localStorage.setItem(
    //       'appPassaparola_stayConnected',
    //       this.formLogin.controls['stayConnected'].value ? 'true' : 'false'
    //     );
    //     this.navController.navigateRoot(['main']);
    //   },
    // });
  }

  loginCompany() {
    if (this.formLogin.invalid) return;
    const pin = `${this.formLogin.controls['code1'].value}${this.formLogin.controls['code2'].value}${this.formLogin.controls['code3'].value}${this.formLogin.controls['code4'].value}${this.formLogin.controls['code5'].value}`;
    const dataLogin: LoginRequets = {
      pin,
      phone: this.formLogin.controls['phone'].value,
      countryCode: this.codeCountry,
    };
    this.authenticationService
      .loginCompany(dataLogin)
      .pipe(
        switchMap((loginRespone) => {
          this.companyLoginResponse = loginRespone;
          return this.walletService.findDefaultWallet(loginRespone.userID!);
        })
      )
      .subscribe({
        next: (response) => {
          localStorage.setItem('walletSelected', JSON.stringify(response));
          localStorage.setItem(
            'appPassaparola_stayConnected',
            this.formLogin.controls['stayConnected'].value ? 'true' : 'false'
          );
          let seat = null;
          if (this.companyLoginResponse.profile?.seats?.length! > 0) {
            seat = this.companyLoginResponse.profile?.seats![0];
            if (seat) {
              localStorage.setItem(
                'appPassaparola_loginSeat',
                JSON.stringify(seat)
              );
            }
          }

          if (seat) {
            this.navController.navigateRoot(['tpv']);
            return;
          }
          this.navController.navigateRoot(['main']);
        },
      });
  }

  inputCode(nroInput: number) {
    if (nroInput == 1 && this.formLogin.controls['code1'].value)
      this.code2!.nativeElement.focus();

    if (nroInput == 2 && this.formLogin.controls['code2'].value)
      this.code3!.nativeElement.focus();

    if (nroInput == 3 && this.formLogin.controls['code3'].value)
      this.code4!.nativeElement.focus();

    if (nroInput == 4 && this.formLogin.controls['code4'].value)
      this.code5!.nativeElement.focus();
  }

  changePin() {
    const phonePrefix = this.formLogin.controls['phonePrefix'].value;
    const phone = this.formLogin.controls['phone'].value;
    this.navController.navigateForward(['change-pin'], {
      queryParams: { phone, phonePrefix },
    });
  }

  cleanInput(index: 'code1' | 'code2' | 'code3' | 'code4' | 'code5') {
    switch (index) {
      case 'code1':
        this.formLogin.controls[index].setValue(null);
        return;

      case 'code2':
        this.formLogin.controls[index].setValue(null);
        return;

      case 'code3':
        this.formLogin.controls[index].setValue(null);
        return;

      case 'code4':
        this.formLogin.controls[index].setValue(null);
        return;

      case 'code5':
        this.formLogin.controls[index].setValue(null);
        return;

      default:
        return;
    }
  }

  checkPhone() {
    // this.authenticationService
    //   .checkPhone(
    //     this.formLogin.controls['phonePrefix'].value,
    //     this.formLogin.controls['phone'].value
    //   )
    //   .subscribe({
    //     next: (response) => {
    //       if (response.user) this.userAvailable = true;
    //       if (response.company) {
    //         this.companyAvailable = true;
    //         this.company = response.company;
    //       }
    //       this.phoneIsChecked = true;
    //     },
    //   });
    this.userService
      .getUserByPhone(
        this.formLogin.controls['phonePrefix'].value,
        this.formLogin.controls['phone'].value
      )
      .subscribe({
        next: (response) => {
          if (!response || !response.pinActive) {
            // this.toastr.error(
            //   this.translate.instant('GENERAL.USER_NOT_REGISTERED')
            // );
            this.goToRegister(false);
            return;
          }

          // if (response.user) this.userAvailable = true;
          // if (response.company) {
          //   this.companyAvailable = true;
          //   this.company = response.company;
          // }
          this.userAvailable = true;
          this.phoneIsChecked = true;
        },
      });
  }

  selectCompanyAccount(data: any, img: string, type: 'main' | 'seat') {
    if (type === 'main') {
      this.accountCompany = {
        id: data.id,
        name: data.name,
        title: 'Sede legale',
        info: 'accesso completo',
        img,
        type,
      };
    }

    if (type === 'seat') {
      this.accountCompany = {
        id: data.id,
        name: `${data.name} - ${data.address}`,
        title: 'Sede legale',
        info: 'accesso parziale',
        img,
        type,
        prog: data.prog,
      };
    }
  }

  loginSeat() {
    if (this.formLogin.invalid) return;
    const pin = `${this.formLogin.controls['code1'].value}${this.formLogin.controls['code2'].value}${this.formLogin.controls['code3'].value}${this.formLogin.controls['code4'].value}${this.formLogin.controls['code5'].value}`;
    const loginRequets: LoginRequets = {
      pin,
      id: this.company.id,
      seatdId: this.accountCompany.id,
    };
    this.authenticationService.loginSeat(loginRequets).subscribe({
      next: (reponse) => {
        localStorage.setItem(
          'walletSelected',
          JSON.stringify(reponse.seat?.wallet)
        );
        this.navController.navigateRoot(['tpv']);
      },
    });
  }

  loginCompanytOrSeat() {
    this.isLoginCompany = true;
  }

  loginBusiness() {
    if (this.accountCompany.type === 'main') this.loginCompany();
    if (this.accountCompany.type === 'seat') this.loginSeat();
  }

  back() {
    if (this.phoneIsChecked && !this.isLoginCompany) {
      this.phoneIsChecked = false;
      return;
    }

    if (this.phoneIsChecked && this.isLoginCompany && !this.accountCompany.id) {
      this.isLoginCompany = false;
      return;
    }

    if (this.phoneIsChecked && this.isLoginCompany && this.accountCompany.id)
      this.accountCompany = {} as AccountCompany;
  }

  subscribeBackButton() {
    this.backButtonSubscribe = this.platform.backButton.subscribeWithPriority(
      1,
      async () => {
        const modal = await this.modalController.getTop();
        if (modal) {
          this.modalController.dismiss();
          return;
        }

        const currentUrl = localStorage.getItem('appPassaparola_currentUrl');
        if (currentUrl?.includes('change-pin')) {
          this.navController.back();
          return;
        }

        if (
          !this.phoneIsChecked &&
          !this.isLoginCompany &&
          !this.accountCompany.id
        )
          this.closeApp();
        this.back();
      }
    );
  }

  async closeApp() {
    const alert = await this.alertController.create({
      header: this.translate.instant('GENERAL.CLOSE_APP'),
      mode: 'ios',
      message: this.translate.instant('GENERAL.CLOSE_APP_2'),
      buttons: [
        {
          text: this.translate.instant('GENERAL.NO'),
          role: 'cancel',
          cssClass: 'botonAlert',
          handler: () => {},
        },
        {
          text: this.translate.instant('GENERAL.YES'),
          cssClass: 'botonAlert',
          handler: () => App.exitApp(),
        },
      ],
    });
    await alert.present();
  }

  togglePasswordVisibility(inputElement: HTMLInputElement) {
    inputElement.type = 'text';
    setTimeout(() => {
      inputElement.type = 'password';
    }, 100);
  }

  async goToRegister(newUser: boolean) {
    this.navController.navigateRoot(['sing-up'], {
      queryParams: {
        phone: newUser ? null : this.formLogin.controls['phone'].value,
        phonePrefix: newUser
          ? null
          : this.formLogin.controls['phonePrefix'].value,
        codeCountry: newUser ? null : this.codeCountry,
      },
    });
  }
}
