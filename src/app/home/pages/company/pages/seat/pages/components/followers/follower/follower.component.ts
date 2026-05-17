import { CommonModule }                                     from '@angular/common';
import { Component, Input }                                 from '@angular/core';
import { IonicModule, ModalController, NavController }      from '@ionic/angular';
import { SocialService }                                    from 'src/app/shared/services/social.service';

@Component({
  selector: 'app-follower',
  templateUrl: './follower.component.html',
  styleUrls: ['./follower.component.scss'],
  imports: [
    IonicModule,
    CommonModule
  ],
  standalone: true,
  providers: [
    ModalController,
    NavController
  ]
})
export class FollowerComponent {
  @Input() follower: any;
  @Input() id: any;

  constructor(
    private socialService: SocialService,
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ){}

  // get my() {
  //   return this.idUserOrCompany === this.follower?.followerEntity?.id ? true : false;
  // }

  // private get idUserOrCompany () {
  //   const user = this.getLocalStorageItem('appPassaparola_user');
  //   return user?.id;
  // }

  // private getLocalStorageItem(key: string): any {
  //   const item = localStorage.getItem(key);
  //   return item ? JSON.parse(item) : null;
  // }

  // follow() {
  //   this.socialService.follow(this.id).subscribe()
  // }

  get idUser(): string {
    return JSON.parse(localStorage.getItem('appPassaparola_user')!).id
  }

  // VIEW PROFILE
  onProfile() {
    // return;
    if (this.follower.entity?.rol) {
      this.onProfileUser(this.follower.entity.id)
    } else {
      this.onProfileBusiness(this.follower.entity.id)
    }
  }
  onProfileUser(id: string) {
    this.modalCtrl.dismiss();
    this.navCtrl.navigateForward(['/pages/company/seat/modify-simple', id],
      (id != this.idUser) ? { queryParams: { detail: true } } : {}
    );
  }
  onProfileBusiness(id: string) {
    this.modalCtrl.dismiss();
    this.navCtrl.navigateForward(['/pages/company/seat/modify', id],
      (id != this.idUser) ? { queryParams: { detail: true } } : {}
    );
  }

}
