import { Component, Input, OnInit } from '@angular/core';
import { CameraSource } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { Company } from 'src/app/shared/interfaces/company/company.interface';
import { ProfileCompany } from 'src/app/shared/interfaces/company/profile-company.interface';
import { Profile } from 'src/app/shared/interfaces/user/profile.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import {
  CompanyService,
  UploadService,
  UserService,
} from 'src/app/shared/services';

import { CameraService } from 'src/app/shared/services/camera.service';

@Component({
  selector: 'app-modal-img-profile',
  templateUrl: './modal-img-profile.component.html',
  styleUrls: ['./modal-img-profile.component.scss'],
})
export class ModalImgProfileComponent implements OnInit {
  profilePictureUrl = '';
  profilePictureFile: Blob | undefined;
  @Input() user: User | Company | any | undefined;
  @Input() profile: Profile | ProfileCompany | any | undefined;
  @Input() isLoginCompany = false;

  constructor(
    private cameraService: CameraService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private uploadService: UploadService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private companyService: CompanyService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  async takePicture() {
    this.cameraService
      .getPhoto(CameraSource.Prompt)
      .then(({ imageUrl, file }) => {
        this.profilePictureUrl = imageUrl!;
        this.profilePictureFile = file;
      })
      .catch((err) => {
        console.error(err);
      });
  }

  async updateInfo() {
    this.spinner.show();
    this.profile = {
      id: this.profile.id,
    };
    const arrayTypeFile = this.profilePictureFile!.type.split('/');
    const type = arrayTypeFile[1];
    const path = `passaparola/profile/pictures/${this.user.userID}.${type}`;
    const fileUpload = await this.uploadService.uploadFile(
      this.profilePictureFile!,
      path
    );
    if (!fileUpload) {
      this.toastr.error(this.translate.instant('GENERAL.ERROR_UP_IMG_PROFILE'));
    }
    this.profile.profilePictureUrlFile = fileUpload
      ? path
      : this.profile.profilePictureUrlFile;

    if (!this.isLoginCompany) {
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
            this.modalController.dismiss();
          },
        });
    }

    if (this.isLoginCompany) {
      this.companyService
        .updateCompanyProfile({ ...this.profile, id: this.profile.id })
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
            this.modalController.dismiss();
          },
        });
    }
  }
}
