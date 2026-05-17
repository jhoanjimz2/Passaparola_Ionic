import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { Company } from 'src/app/shared/interfaces/company/company.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { CompanyService, UserService } from 'src/app/shared/services';

@Component({
  selector: 'app-notifications-config',
  templateUrl: './notifications-config.component.html',
  styleUrls: ['./notifications-config.component.scss'],
})
export class NotificationsConfigComponent implements OnInit {
  @Input() user: (User & Company) | undefined;
  configForm: FormGroup = {} as FormGroup;
  isCompany: boolean = false;

  constructor(
    private formBuild: FormBuilder,
    private userService: UserService,
    private companyService: CompanyService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.buildConfigForm();
    this.configForm.statusChanges.subscribe((status) => {
      const fieldsToDisable = [
        'checkEmail2',
        'checkEmail3',
        'checkPhone2',
        'checkPhone3',
      ];

      fieldsToDisable.forEach((field) => {
        const control = this.configForm.get(field);
        if (status === 'INVALID' && control?.enabled) {
          control.disable({ emitEvent: false });
        } else if (status === 'VALID' && control?.disabled) {
          control.enable({ emitEvent: false });
        }
      });
    });
  }

  buildConfigForm() {
    this.user = JSON.parse(this.user as string);
    this.isCompany =
      this.user?.rol === 'company' || this.user?.rol === 'professional'
        ? true
        : false;

    let email1 = '';
    let email2 = '';
    let email3 = '';
    let checkEmail1 = false;
    let checkEmail2 = false;
    let checkEmail3 = false;

    // if (this.user?.emails?.length === 1) {
    //   email1 = this.user?.emails[0];
    //   checkEmail1 = true;
    // }

    email1 = this.user?.email!;
    checkEmail1 = true;

    if (this.user?.emails?.length === 2) {
      email2 = this.user?.emails[1];
      checkEmail2 = true;
    }

    if (this.user?.emails?.length === 3) {
      email2 = this.user?.emails[1];
      email3 = this.user?.emails[2];
      checkEmail2 = true;
      checkEmail3 = true;
    }

    let phone1 = '';
    let phone2 = '';
    let phone3 = '';
    let checkPhone1 = false;
    let checkPhone2 = false;
    let checkPhone3 = false;

    phone1 = this.user?.country?.phonePrefix + this.user?.phoneNumber!;
    checkPhone1 = true;

    if (this.user?.phones?.length === 2) {
      phone2 = this.user?.phones[1];
      checkPhone2 = true;
    }

    if (this.user?.phones?.length === 3) {
      phone2 = this.user?.phones[1];
      phone3 = this.user?.phones[2];
      checkPhone2 = true;
      checkPhone3 = true;
    }

    this.configForm = this.formBuild.group({
      freeNotification: new FormControl({ value: true, disabled: true }, [
        Validators.required,
      ]),
      freeEmailNotificaction: new FormControl({ value: true, disabled: true }, [
        Validators.required,
      ]),
      email1: new FormControl(email1, [Validators.email]),
      email2: new FormControl(email2, [Validators.email]),
      email3: new FormControl(email3, [Validators.email]),
      phoneNotificaction: new FormControl({ value: true, disabled: true }, [
        Validators.required,
      ]),
      phone1: new FormControl(phone1, []),
      phone2: new FormControl(phone2, []),
      phone3: new FormControl(phone3, []),
      checkEmail1: new FormControl({ value: true, disabled: true }, [
        Validators.required,
      ]),
      checkEmail2: new FormControl(checkEmail2, []),
      checkEmail3: new FormControl(checkEmail3, []),
      checkPhone1: new FormControl({ value: true, disabled: true }, [
        Validators.required,
      ]),
      checkPhone2: new FormControl(checkPhone2, []),
      checkPhone3: new FormControl(checkPhone3, []),
    });
  }

  update(ev: CustomEvent, field?: string) {
    if (this.configForm.invalid) return;

    const emails = [];
    const phones = [];

    if (!ev.detail.checked) {
      // if (field === 'email1') this.configForm?.controls['email1'].setValue('');
      if (field === 'email2') this.configForm?.controls['email2'].setValue('');
      if (field === 'email3') this.configForm?.controls['email3'].setValue('');
      // if (field === 'phone1') this.configForm?.controls['phone1'].setValue('');
      if (field === 'phone2') this.configForm?.controls['phone2'].setValue('');
      if (field === 'phone3') this.configForm?.controls['phone3'].setValue('');
    }

    if (
      ev.detail.checked &&
      field === 'email2' &&
      !this.configForm?.controls['email2'].value
    ) {
      this.configForm?.controls['checkEmail2'].setValue(false);
      return;
    }

    if (
      ev.detail.checked &&
      field === 'email3' &&
      !this.configForm?.controls['email3'].value
    ) {
      this.configForm?.controls['checkEmail3'].setValue(false);
      return;
    }

    if (
      ev.detail.checked &&
      field === 'phone2' &&
      !this.configForm?.controls['phone2'].value
    ) {
      this.configForm?.controls['checkPhone2'].setValue(false);
      return;
    }

    if (
      ev.detail.checked &&
      field === 'phone3' &&
      !this.configForm?.controls['phone3'].value
    ) {
      this.configForm?.controls['checkPhone3'].setValue(false);
      return;
    }

    if (
      this.configForm?.controls['email1'].value &&
      this.configForm?.controls['checkEmail1'].value
    )
      emails.push(this.configForm?.controls['email1'].value);

    if (
      this.configForm?.controls['email2'].value &&
      this.configForm?.controls['checkEmail2'].value
    )
      emails.push(this.configForm?.controls['email2'].value);

    if (
      this.configForm?.controls['email3'].value &&
      this.configForm?.controls['checkEmail3'].value
    )
      emails.push(this.configForm?.controls['email3'].value);

    if (
      this.configForm?.controls['phone1'].value &&
      this.configForm?.controls['checkPhone1'].value
    )
      phones.push(this.configForm?.controls['phone1'].value);

    if (
      this.configForm?.controls['phone2'].value &&
      this.configForm?.controls['checkPhone2'].value
    )
      phones.push(this.configForm?.controls['phone2'].value);

    if (
      this.configForm?.controls['phone3'].value &&
      this.configForm?.controls['checkPhone3'].value
    )
      phones.push(this.configForm?.controls['phone3'].value);

    const requets = {
      freeNotification: this.configForm?.controls['freeNotification'].value,
      freeEmailNotificaction:
        this.configForm?.controls['freeEmailNotificaction'].value,
      phoneNotificaction: this.configForm?.controls['phoneNotificaction'].value,
      emails,
      phones,
    };

    if (!this.isCompany) {
      this.updateUser({
        ...requets,
        id: this.user?.id,
        countryID: this.user?.country?.id,
      });
    } else {
      this.updateCompany({
        ...requets,
        id: this.user?.id,
      });
    }
  }

  updateUser(user: User) {
    this.userService.updateUser({ ...user, id: user.id }).subscribe({
      next: (response) => {
        this.authenticationService.user = {
          ...this.authenticationService.user,
          ...response,
        };
        localStorage.setItem(
          'appPassaparola_user',
          JSON.stringify(this.authenticationService.user)
        );
        this.authenticationService.myUserSet(this.authenticationService.user);
      },
    });
  }

  updateCompany(company: Company) {
    this.companyService
      .updateCompany({ ...company, id: company.id })
      .subscribe({
        next: (response) => {
          this.authenticationService.user = {
            ...this.authenticationService.user,
            ...response,
          };
          localStorage.setItem(
            'appPassaparola_user',
            JSON.stringify(this.authenticationService.user)
          );
          this.authenticationService.myUserSet(this.authenticationService.user);
        },
      });
  }
}
