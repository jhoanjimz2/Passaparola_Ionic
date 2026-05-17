import { Component, OnInit }              from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { CameraSource }                   from '@capacitor/camera';

import { Subscription }                   from 'rxjs';
import { TranslateService }               from '@ngx-translate/core';
import { ToastrService }                  from 'ngx-toastr';
import { NgxSpinnerService }              from 'ngx-spinner';

import { AuthenticationService }          from 'src/app/core/service/authentication.service';
import { Profile }                        from 'src/app/shared/interfaces/user/profile.interface';
import { User }                           from 'src/app/shared/interfaces/user/user.interface';
import {
  CommunityService,
  CompanyService,
  UploadService,
  UserService,
} from 'src/app/shared/services';
import { CameraService }                  from 'src/app/shared/services/camera.service';
import { Company }                        from 'src/app/shared/interfaces/company/company.interface';
import { ProfileCompany }                 from 'src/app/shared/interfaces/company/profile-company.interface';
import { SummaryCommunity }               from 'src/app/shared/interfaces/community/summary-friends.interface';
import { ModalImgProfileComponent }       from './components/modal-img-profile/modal-img-profile.component';
import { ModalInfoProfileComponent }      from './components/modal-info-profile/modal-info-profile.component';
import { PreferenceFeedSocialComponent }  from 'src/app/components/preference-feed-social/preference-feed-social.component';
import { SessionService }                 from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.page.html',
  styleUrls: ['./profile-info.page.scss'],
})
export class ProfileInfoPage implements OnInit {
  user: User | Company | any | undefined = {} as User | Company;
  subscriptionMyUser: Subscription | undefined;
  profile: Profile | ProfileCompany | any | undefined = {} as
    | Profile
    | ProfileCompany;
  btbPostActive: 'myPost' | 'liked' | 'saved' = 'myPost';
  profilePictureUrl = '';
  profilePictureFile: Blob | undefined;
  isLoginCompany = false;
  summaryCommunity: SummaryCommunity[] = [];
  communityFriends = 0;

  constructor(
    private navController: NavController,
    private authenticationService: AuthenticationService,
    private sessionService: SessionService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private uploadService: UploadService,
    private cameraService: CameraService,
    private companyService: CompanyService,
    private communityService: CommunityService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.user = this.authenticationService.user;
    if (this.user.userID!.rol === 'company') {
      this.isLoginCompany = true;
    }
    this.getProfileById();
    this.myUserWatch();
    this.getSummaryCommunityByCountry();
  }

  goTo(url: string) {
    this.navController.navigateForward([url]);
  }

  myUserWatch() {
    this.subscriptionMyUser = this.authenticationService
      .myUserWatch()
      .subscribe((user: User) => {
        if (!user) return;
        this.user = user;
        this.profile = this.user.profile!;
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
            if (this.profile?.profilePictureUrlFile) {
              this.profile.profilePictureUrlFile += `?t=${new Date().getTime()}`;
            }

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
          },
        });
    }

    if (this.isLoginCompany) {
      this.companyService
        .updateCompanyProfile({ ...this.profile, id: this.profile.id })
        .subscribe({
          next: (response) => {
            if (this.profile?.profilePictureUrlFile) {
              this.profile.profilePictureUrlFile += `?t=${new Date().getTime()}`;
            }

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
          },
        });
    }
  }

  getProfileById() {
    if (!this.isLoginCompany) {
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
          localStorage.setItem(
            'appPassaparola_user',
            JSON.stringify(this.user)
          );
          this.authenticationService.myUserSet(this.user);

          if (!this.profile.profilePictureUrlFile) {
            setTimeout(() => {
              this.modalImage();
            }, 1500);
          } else if (!this.profile.name || !this.profile.username) {
            setTimeout(() => {
              this.modalInfoProfile();
            }, 1500);
          } else {
            setTimeout(() => {
              const appPassaparola_preferenceFeed = localStorage.getItem(
                'appPassaparola_preferenceFeed'
              );
              // 👇 solo abre el modal si el rol es 'user'
              if (!appPassaparola_preferenceFeed && this.sessionService.isUser)
                this.modalSetPreferenceFeed();
            }, 1500);
          }
        },
      });
    }

    if (this.isLoginCompany) {
      this.companyService.getCompanyProfile(this.user.profile?.id!).subscribe({
        next: (response) => {
          this.user.profile = response;
          this.authenticationService.user = {
            ...this.user,
          };
          localStorage.setItem(
            'appPassaparola_user',
            JSON.stringify(this.user)
          );
          this.authenticationService.myUserSet(this.user);
        },
      });
    }
  }

  async takePicture() {
    this.cameraService
      .getPhoto(CameraSource.Prompt)
      .then(({ imageUrl, file }) => {
        this.profilePictureUrl = imageUrl!;
        this.profilePictureFile = file;
        this.updateInfo();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  getSummaryCommunityByCountry() {
    this.communityService
      .findSummaryCommunityByCountry(this.user.userID!, 0, 0)
      .subscribe({
        next: (response) => {
          this.summaryCommunity = response;
          this.communityFriends = response.reduce(
            (sum, item) => sum + item.friends,
            0
          );
        },
      });
  }

  async modalImage() {
    const modal = await this.modalController.create({
      component: ModalImgProfileComponent,
      cssClass: 'modal-onboarding',
      backdropDismiss: false,
      componentProps: {
        user: this.user,
        profile: this.profile,
        isLoginCompany: this.isLoginCompany,
      },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (!this.profile.name || !this.profile.username) {
      setTimeout(() => {
        this.modalInfoProfile();
      }, 1500);
    }
  }

  async modalInfoProfile() {
    const appPassaparola_preferenceFeed = localStorage.getItem(
      'appPassaparola_preferenceFeed'
    );
    const modal = await this.modalController.create({
      component: ModalInfoProfileComponent,
      cssClass: 'modal-onboarding',
      backdropDismiss: false,
      componentProps: {
        user: this.user,
        profile: this.profile,
        isLoginCompany: this.isLoginCompany,
      },
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();

    setTimeout(() => {
      // 👇 solo abre el modal si el rol es 'user'
      if (!appPassaparola_preferenceFeed && this.sessionService.isUser)
        this.modalSetPreferenceFeed();
    }, 1500);
  }

  async modalSetPreferenceFeed() {
    const modal = await this.modalController.create({
      component: PreferenceFeedSocialComponent,
      cssClass: ['radius-modals', 'modal-75vh'],
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    localStorage.setItem('appPassaparola_preferenceFeed', 'true');
  }
}
