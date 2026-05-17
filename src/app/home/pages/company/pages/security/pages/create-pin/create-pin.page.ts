import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { Company } from 'src/app/shared/interfaces/company/company.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { CompanyService, UserService } from 'src/app/shared/services';

@Component({
  selector: 'app-company-create-pin',
  templateUrl: './create-pin.page.html',
  styleUrls: ['./create-pin.page.scss'],
})
export class CreatePinPage implements OnInit {
  user: Company = {} as Company;
  formPin: FormGroup = {} as FormGroup;
  showPassword = false;
  rshowPassword = false;
  changePinSuccess = false;

  @ViewChild('code1', { static: false }) code1: ElementRef | undefined;
  @ViewChild('code2', { static: false }) code2: ElementRef | undefined;
  @ViewChild('code3', { static: false }) code3: ElementRef | undefined;
  @ViewChild('code4', { static: false }) code4: ElementRef | undefined;
  @ViewChild('code5', { static: false }) code5: ElementRef | undefined;
  @ViewChild('rcode1', { static: false }) rcode1: ElementRef | undefined;
  @ViewChild('rcode2', { static: false }) rcode2: ElementRef | undefined;
  @ViewChild('rcode3', { static: false }) rcode3: ElementRef | undefined;
  @ViewChild('rcode4', { static: false }) rcode4: ElementRef | undefined;
  @ViewChild('rcode5', { static: false }) rcode5: ElementRef | undefined;

  constructor(
    private formBuild: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService,
    private translate: TranslateService,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.user = this.authenticationService.user;
    this.buildFormPin();
  }

  buildFormPin() {
    this.formPin = this.formBuild.group({
      code1: new FormControl('', [Validators.required]),
      code2: new FormControl('', [Validators.required]),
      code3: new FormControl('', [Validators.required]),
      code4: new FormControl('', [Validators.required]),
      code5: new FormControl('', [Validators.required]),
      rcode1: new FormControl('', [Validators.required]),
      rcode2: new FormControl('', [Validators.required]),
      rcode3: new FormControl('', [Validators.required]),
      rcode4: new FormControl('', [Validators.required]),
      rcode5: new FormControl('', [Validators.required]),
    });
  }

  createPin() {
    const pin = `${this.formPin.controls['code1'].value}${this.formPin.controls['code2'].value}${this.formPin.controls['code3'].value}${this.formPin.controls['code4'].value}${this.formPin.controls['code5'].value}`;
    const rpin = `${this.formPin.controls['rcode1'].value}${this.formPin.controls['rcode2'].value}${this.formPin.controls['rcode3'].value}${this.formPin.controls['rcode4'].value}${this.formPin.controls['rcode5'].value}`;

    if (pin !== rpin) {
      this.toastr.error(this.translate.instant('SING_UP.ERROR_PIN'));
      return;
    }

    const user: Company = {
      id: this.user.id,
      pin,
      // country: this.user.country,
      phoneNumber: this.user.phoneNumber,
      // type: this.user.type,
    };
    this.companyService.updateCompany(user).subscribe({
      next: (respose) => {
        this.user = respose;
      },
      error: (error) => console.error(error),
      complete: () => (this.changePinSuccess = true),
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

  inputRcode(nroInput: number) {
    if (nroInput == 1 && this.formPin.controls['rcode1'].value)
      this.rcode2!.nativeElement.focus();

    if (nroInput == 2 && this.formPin.controls['rcode2'].value)
      this.rcode3!.nativeElement.focus();

    if (nroInput == 3 && this.formPin.controls['rcode3'].value)
      this.rcode4!.nativeElement.focus();

    if (nroInput == 4 && this.formPin.controls['rcode4'].value)
      this.rcode5!.nativeElement.focus();
  }
}
