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
import { TranslateService } from '@ngx-translate/core';

import { ToastrService } from 'ngx-toastr';
import { Company } from 'src/app/shared/interfaces/company/company.interface';

import { User } from 'src/app/shared/interfaces/user/user.interface';
import { CompanyService } from 'src/app/shared/services';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-create-pin',
  templateUrl: './create-pin.component.html',
  styleUrls: ['./create-pin.component.scss'],
})
export class CreatePinComponent implements OnInit {
  @Input() user: User = {} as User;
  @Input() company: Company = {} as Company;
  @Input() pinChange: 'user' | 'company' | '' = '';
  formPin: FormGroup = {} as FormGroup;
  showPassword = false;
  rshowPassword = false;
  @Output() userEmit: EventEmitter<User> = new EventEmitter<User>();
  @Output() changePinSuccess: EventEmitter<boolean> =
    new EventEmitter<boolean>();

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
    private translate: TranslateService,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.buildFormCode();
  }

  buildFormCode() {
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

    if (this.pinChange === 'user') {
      const user = {
        id: this.user.id,
        pin,
        countryID: this.user.country!.id,
        phoneNumber: this.user.phoneNumber,
      };
      this.userService.updateUserPin(user).subscribe({
        next: (respose) => {
          this.user = respose;
          this.changePinSuccess.emit(true);
        },
        error: (error) => console.error(error),
        complete: () => {},
      });
    }

    if (this.pinChange === 'company') {
      const company = {
        id: this.company.id,
        pin,
      };

      this.companyService.updatePin(company).subscribe({
        next: (respose) => {
          this.company = respose;
          this.changePinSuccess.emit(true);
        },
        error: (error) => console.error(error),
        complete: () => {},
      });
    }
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

  cleanInput(
    index:
      | 'code1'
      | 'code2'
      | 'code3'
      | 'code4'
      | 'code5'
      | 'rcode1'
      | 'rcode2'
      | 'rcode3'
      | 'rcode4'
      | 'rcode5'
  ) {
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

      case 'rcode1':
        this.formPin.controls[index].setValue(null);
        return;

      case 'rcode2':
        this.formPin.controls[index].setValue(null);
        return;

      case 'rcode3':
        this.formPin.controls[index].setValue(null);
        return;

      case 'rcode4':
        this.formPin.controls[index].setValue(null);
        return;

      case 'rcode5':
        this.formPin.controls[index].setValue(null);
        return;

      default:
        return;
    }
  }
}
