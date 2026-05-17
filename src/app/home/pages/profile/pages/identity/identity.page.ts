import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CameraSource } from '@capacitor/camera';

import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { Country } from 'src/app/shared/interfaces/country/country.interface';
import { CountryService, UserService } from 'src/app/shared/services';
import { AuthenticationService } from '../../../../../core/service/authentication.service';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { Profile } from 'src/app/shared/interfaces/user/profile.interface';
import { UploadService } from '../../../../../shared/services/upload.service';
import { CameraService } from 'src/app/shared/services/camera.service';

@Component({
  selector: 'app-identity',
  templateUrl: './identity.page.html',
  styleUrls: ['./identity.page.scss'],
})
export class IdentityPage implements OnInit {
  countries: Country[] = [];
  formIdentity: FormGroup = {} as FormGroup;
  user: User = {} as User;
  profile: Profile = {} as Profile;
  disabledForm = true;

  idCardUrl = '';
  idCardFile: Blob | undefined;
  proofResidencyUrl = '';
  proofResidencyFile: Blob | undefined;

  constructor(
    private formBuild: FormBuilder,
    private countryService: CountryService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private translate: TranslateService,
    private uploadService: UploadService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private cameraService: CameraService
  ) {}

  ngOnInit() {
    this.user = this.authenticationService.user;
    this.getCountries();
    this.getProfileById();
    this.buildFormIdentity();
  }

  buildFormIdentity() {
    this.formIdentity = this.formBuild.group({
      name: new FormControl(
        { value: this.profile.name, disabled: this.disabledForm },
        [Validators.required]
      ),
      lastName: new FormControl(
        { value: this.profile.lastName, disabled: this.disabledForm },
        [Validators.required]
      ),
      username: new FormControl(
        { value: this.profile.username, disabled: this.disabledForm },
        [Validators.required]
      ),
      dateBirth: new FormControl(
        { value: this.profile.dateBirth, disabled: this.disabledForm },
        [Validators.required]
      ),
      taxNumber: new FormControl(
        { value: this.profile.taxNumber, disabled: this.disabledForm },
        [Validators.required]
      ),
      countryResidenceId: new FormControl(
        {
          value: this.profile.countryResidence?.id
            ? this.profile.countryResidence?.id
            : '',
          disabled: this.disabledForm,
        },
        [Validators.required]
      ),
      residenceAddress: new FormControl(
        { value: this.profile.residenceAddress, disabled: this.disabledForm },
        [Validators.required]
      ),
      homeCountryId: new FormControl(
        {
          value: this.profile.homeCountry?.id
            ? this.profile.homeCountry?.id
            : '',
          disabled: this.disabledForm,
        },
        [Validators.required]
      ),
      homeAddress: new FormControl(
        { value: this.profile.homeAddress, disabled: this.disabledForm },
        [Validators.required]
      ),
      domicile: new FormControl(
        { value: false, disabled: this.disabledForm },
        []
      ),
    });
  }

  getCountries() {
    this.countryService.findAll().subscribe({
      next: (response) => (this.countries = response),
    });
  }

  getProfileById() {
    this.userService.getProfileById(this.user.profile?.id!).subscribe({
      next: (response) => {
        const arrayDateBirth = response.dateBirth
          ? response.dateBirth?.split('T')
          : null;
        this.profile = {
          ...response,
          dateBirth: arrayDateBirth ? arrayDateBirth![0] : '',
        };
        this.user.profile = response;
        this.authenticationService.user = {
          ...this.user,
        };
        localStorage.setItem('appPassaparola_user', JSON.stringify(this.user));
        this.authenticationService.myUserSet(this.user);
        this.buildFormIdentity();
        this.checkAddress();
      },
    });
  }

  async updateInfo() {
    this.spinner.show();
    this.profile = this.authenticationService.user.profile!;
    this.profile = {
      id: this.profile.id,
      name: this.formIdentity.controls['name'].value,
      lastName: this.formIdentity.controls['lastName'].value,
      username: this.formIdentity.controls['username'].value,
      dateBirth: this.formIdentity.controls['dateBirth'].value,
      taxNumber: this.formIdentity.controls['taxNumber'].value,
      countryResidenceId:
        this.formIdentity.controls['countryResidenceId'].value,
      residenceAddress: this.formIdentity.controls['residenceAddress'].value,
      homeCountryId: this.formIdentity.controls['domicile'].value
        ? this.formIdentity.controls['countryResidenceId'].value
        : this.formIdentity.controls['homeCountryId'].value,
      homeAddress: this.formIdentity.controls['domicile'].value
        ? this.formIdentity.controls['residenceAddress'].value
        : this.formIdentity.controls['homeAddress'].value,
    };

    if (this.idCardFile) {
      if (this.proofResidencyFile) {
        const arrayTypeFileFront = this.idCardFile!.type.split('/');
        const typeFileFront = arrayTypeFileFront[1];
        const pathFileFront = `passaparola/profile/id-cards/${this.user.userID}-id-card.${typeFileFront}`;

        const arrayTypeFileBack = this.proofResidencyFile!.type.split('/');
        const typeFileBack = arrayTypeFileBack[1];
        const pathFileBack = `passaparola/profile/id-cards/${this.user.userID}-proof-residency.${typeFileBack}`;

        const promises = [
          await this.uploadService.uploadFile(this.idCardFile!, pathFileFront),
          await this.uploadService.uploadFile(
            this.proofResidencyFile!,
            pathFileBack
          ),
        ];

        const results = await Promise.all([promises]);

        if (results[0].includes(false))
          this.toastr.error(
            this.translate.instant('GENERAL.ERROR_UP_IMG_ID_RESIDENCE_DOC')
          );

        this.profile.idCardUrlFile = results
          ? pathFileFront
          : this.profile.idCardUrlFile;

        this.profile.proofResidencyUrlFile = results
          ? pathFileBack
          : this.profile.proofResidencyUrlFile;
      } else {
        const arrayTypeFile = this.idCardFile!.type.split('/');
        const type = arrayTypeFile[1];
        const path = `passaparola/profile/id-cards/${this.user.userID}-id-card.${type}`;
        const fileUpload: any = await this.uploadService.uploadFile(
          this.idCardFile!,
          path
        );
        if (!fileUpload) {
          this.toastr.error(
            this.translate.instant('GENERAL.ERROR_UP_IMG_ID_DOC')
          );
        }
        this.profile.idCardUrlFile = fileUpload
          ? path
          : this.profile.idCardUrlFile;
      }
    } else {
      if (this.proofResidencyFile) {
        const arrayTypeFile = this.proofResidencyFile!.type.split('/');
        const type = arrayTypeFile[1];
        const path = `passaparola/profile/id-cards/${this.user.userID}-proof-residency.${type}`;
        const fileUpload = await this.uploadService.uploadFile(
          this.proofResidencyFile!,
          path
        );
        if (!fileUpload) {
          this.toastr.error(
            this.translate.instant('GENERAL.ERROR_UP_IMG_RESIDENCE_DOC')
          );
        }
        this.profile.proofResidencyUrlFile = fileUpload
          ? path
          : this.profile.proofResidencyUrlFile;
      }
    }

    this.userService
      .updateProfile({ ...this.profile, id: this.profile.id })
      .subscribe({
        next: (response) => {
          this.profile = response;
          this.user.profile = this.user.profile = response;
          this.authenticationService.user = {
            ...this.user,
          };
          localStorage.setItem(
            'appPassaparola_user',
            JSON.stringify(this.user)
          );
          this.authenticationService.myUserSet(this.user);
          this.editProfile();
        },
      });
  }

  domicileIsResicence() {
    const domicile = this.formIdentity.controls['domicile'].value;
    if (!domicile) {
      this.formIdentity.controls['homeCountryId'].setValue(
        this.profile.homeCountry?.id
      );
      this.formIdentity.controls['homeAddress'].setValue(
        this.profile.homeAddress
      );
      return;
    }

    const countryId = this.formIdentity.controls['countryResidenceId'].value;
    const address = this.formIdentity.controls['residenceAddress'].value;
    this.formIdentity.controls['homeCountryId'].setValue(
      countryId ? countryId : ''
    );
    this.formIdentity.controls['homeAddress'].setValue(address ? address : '');
  }

  checkAddress() {
    if (
      this.formIdentity.controls['countryResidenceId'].value &&
      this.formIdentity.controls['residenceAddress'].value
    ) {
      if (
        this.formIdentity.controls['countryResidenceId'].value ===
          this.formIdentity.controls['homeCountryId'].value &&
        this.formIdentity.controls['residenceAddress'].value ===
          this.formIdentity.controls['homeAddress'].value
      ) {
        this.formIdentity.controls['domicile'].setValue(true);
      }
    }
  }

  editProfile() {
    this.disabledForm = !this.disabledForm;
    this.buildFormIdentity();
    this.checkAddress();
  }

  async takePicture(picture: 'front' | 'back') {
    if (this.disabledForm) return;

    this.cameraService
      .getPhoto(CameraSource.Prompt)
      .then(({ imageUrl, file }) => {
        if (picture === 'front') {
          this.idCardUrl = imageUrl!;
          this.idCardFile = file;
        }
        if (picture === 'back') {
          this.proofResidencyUrl = imageUrl!;
          this.proofResidencyFile = file;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
