import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavController } from '@ionic/angular';

import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { LoginRequets } from 'src/app/shared/interfaces/user/requets/login-requets.interface';

@Component({
  selector: 'app-security',
  templateUrl: './security.page.html',
  styleUrls: ['./security.page.scss'],
})
export class SecurityPage implements OnInit {
  formPin: FormGroup = {} as FormGroup;
  showPassword = false;

  @ViewChild('code1', { static: false }) code1: ElementRef | undefined;
  @ViewChild('code2', { static: false }) code2: ElementRef | undefined;
  @ViewChild('code3', { static: false }) code3: ElementRef | undefined;
  @ViewChild('code4', { static: false }) code4: ElementRef | undefined;
  @ViewChild('code5', { static: false }) code5: ElementRef | undefined;

  constructor(
    private formBuild: FormBuilder,
    private authenticationService: AuthenticationService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.buildFormPin();
  }

  buildFormPin() {
    this.formPin = this.formBuild.group({
      code1: new FormControl('', [Validators.required]),
      code2: new FormControl('', [Validators.required]),
      code3: new FormControl('', [Validators.required]),
      code4: new FormControl('', [Validators.required]),
      code5: new FormControl('', [Validators.required]),
    });
  }

  changePin() {
    const pin = `${this.formPin.controls['code1'].value}${this.formPin.controls['code2'].value}${this.formPin.controls['code3'].value}${this.formPin.controls['code4'].value}${this.formPin.controls['code5'].value}`;
    const loginReq: LoginRequets = {
      countryCode: this.authenticationService.user.country?.code!,
      phone: this.authenticationService.user.phoneNumber!,
      pin,
    };
    this.authenticationService.checkLogin(loginReq).subscribe({
      next: (response) =>
        this.navController.navigateForward([
          'pages/profile/security-account/check-code',
        ]),
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
}
