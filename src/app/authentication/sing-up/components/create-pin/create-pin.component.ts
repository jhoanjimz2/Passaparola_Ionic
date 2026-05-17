import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
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

import { User } from 'src/app/shared/interfaces/user/user.interface';
import { UserService } from 'src/app/shared/services/user.service';
import { NavController } from '@ionic/angular';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { WalletService } from 'src/app/shared/services';
import { LoginRequets } from 'src/app/shared/interfaces/user/requets/login-requets.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-pin',
  templateUrl: './create-pin.component.html',
  styleUrls: ['./create-pin.component.scss'],
})
export class CreatePinComponent implements OnInit {
  @Input() user: User = {} as User;
  formPin: FormGroup = {} as FormGroup;
  showPassword = false;
  @Output() userEmit: EventEmitter<User> = new EventEmitter<User>();

  @ViewChild('code1', { static: false }) code1: ElementRef | undefined;
  @ViewChild('code2', { static: false }) code2: ElementRef | undefined;
  @ViewChild('code3', { static: false }) code3: ElementRef | undefined;
  @ViewChild('code4', { static: false }) code4: ElementRef | undefined;
  @ViewChild('code5', { static: false }) code5: ElementRef | undefined;

  @Input() promoCode: string | undefined;
  searchTermPromoCode = new FormControl();

  constructor(
    private formBuild: FormBuilder,
    private userService: UserService,
    private navController: NavController,
    private userSerice: UserService,
    private authenticationService: AuthenticationService,
    private walletService: WalletService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.buildFormCode();
    if (this.promoCode) {
      this.searchTermPromoCode.setValue(this.promoCode);
    } else {
      this.checkPromoCode();
    }
  }

  buildFormCode() {
    this.formPin = this.formBuild.group({
      code1: new FormControl('', [Validators.required]),
      code2: new FormControl('', [Validators.required]),
      code3: new FormControl('', [Validators.required]),
      code4: new FormControl('', [Validators.required]),
      code5: new FormControl('', [Validators.required]),
      termApp: new FormControl(false, [Validators.requiredTrue]),
      termCookies: new FormControl(false, [Validators.requiredTrue]),
      privacy: new FormControl(false, [Validators.requiredTrue]),
    });
  }

  createPin() {
    const pin = `${this.formPin.controls['code1'].value}${this.formPin.controls['code2'].value}${this.formPin.controls['code3'].value}${this.formPin.controls['code4'].value}${this.formPin.controls['code5'].value}`;
    const user = {
      id: this.user.id,
      pin,
      countryID: this.user.country!.id,
      phoneNumber: this.user.phoneNumber,
      promoCode: this.user.promoCode,
    };
    this.userService.activateUser(user).subscribe({
      next: (respose) => {
        this.user = respose;
        this.toastr.success('¡Utente registrato correttamente!');
        this.loginUser(pin);
      },
    });
  }

  inputCode(nroInput: number) {
    if (nroInput == 1 && this.formPin.controls['code1'].value)
      this.code2!.nativeElement.focus();

    if (nroInput == 2 && this.formPin.controls['code2'].value)
      this.code3!.nativeElement.focus();

    if (nroInput == 3 && this.formPin.controls['code3'].value)
      this.code4!.nativeElement.focus();

    if (nroInput == 4 && this.formPin.controls['code4'].value)
      this.code5!.nativeElement.focus();
  }

  checkPromoCode() {
    this.searchTermPromoCode.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((term) => this.userSerice.checkPromoCode(term))
      )
      .subscribe({
        next: (response) => {
          this.user.promoCode = response.promoCode;
          this.checkPromoCode();
        },
        error: () => {
          this.user.promoCode = '';
          this.checkPromoCode();
        },
      });
  }

  cleanInput(index: 'code1' | 'code2' | 'code3' | 'code4' | 'code5') {
    switch (index) {
      case 'code1':
        this.formPin.controls[index].setValue(null);
        return;

      case 'code2':
        this.formPin.controls[index].setValue(null);
        return;

      case 'code3':
        this.formPin.controls[index].setValue(null);
        return;

      case 'code4':
        this.formPin.controls[index].setValue(null);
        return;

      case 'code5':
        this.formPin.controls[index].setValue(null);
        return;

      default:
        return;
    }
  }

  loginUser(pin: string) {
    const dataLogin: LoginRequets = {
      pin,
      phone: this.user.phoneNumber,
      countryCode: this.user.country?.code,
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
          this.navController.navigateRoot(['main']);
        },
      });
  }
}
