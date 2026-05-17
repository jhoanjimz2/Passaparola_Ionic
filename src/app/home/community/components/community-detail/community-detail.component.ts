import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { SummaryCommunity } from 'src/app/shared/interfaces/community/summary-friends.interface';
import { FriendsComponent } from '../friends/friends.component';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { WalletService } from 'src/app/shared/services';
import { WorldRewardPoints } from 'src/app/shared/interfaces/wallet/world-reward-points.interface';
import { FriendsByLevelComponent } from '../friends-by-level/friends-by-level.component';

@Component({
  selector: 'app-community-detail',
  templateUrl: './community-detail.component.html',
  styleUrls: ['./community-detail.component.scss'],
})
export class CommunityDetailComponent implements OnInit {
  @Input() summaryCommunity: SummaryCommunity = {} as SummaryCommunity;
  showAtm = true;
  user: User = {} as User;
  worldRewardPoints: WorldRewardPoints[] = [];

  constructor(
    private modalController: ModalController,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    const user = localStorage.getItem('appPassaparola_user');
    this.user = user ? JSON.parse(user) : ({} as User);
    this.findWorldRewardPointsByCountry(this.summaryCommunity.countryCode);
  }

  findWorldRewardPointsByCountry(contryCode: string) {
    this.walletService.findWorldRewardPointsByCountry(contryCode).subscribe({
      next: (response) => {
        // this.worldRewardPoints = response.filter((item) => item.level > 0);
        this.worldRewardPoints = response;
        this.getFriendsByLevel();
        this.getEarnings();
      },
    });
  }

  async modalFriends() {
    const modal = await this.modalController.create({
      component: FriendsComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { summaryCommunity: this.summaryCommunity },
    });
    await modal.present();
  }

  getFriendsByLevel() {
    let i = 0;
    this.worldRewardPoints.forEach((world) => {
      const friends = this.summaryCommunity.myFriends.filter(
        (friend) => friend.worldRewardPoints.level === world.level
      );
      this.summaryCommunity.myFriends;
      this.worldRewardPoints[i].friendsBylevel = friends;
      i++;
    });
  }

  getEarnings() {
    let i = 0;
    this.worldRewardPoints.forEach((world) => {
      const friends = this.summaryCommunity.myFriends.filter(
        (friend) => friend.worldRewardPoints.level === world.level
      );
      this.worldRewardPoints[i].earnings = friends.reduce(
        (a, b) => a + b.earnings,
        0
      );
      i++;
    });
  }

  async modalFriendsByLevel(worldRewardPoints: WorldRewardPoints) {
    if (
      worldRewardPoints.level > this.summaryCommunity.worldRewardPoints?.level!
    )
      return;
    const modal = await this.modalController.create({
      component: FriendsByLevelComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: {
        summaryCommunity: this.summaryCommunity,
        worldRewardPoints,
      },
    });
    await modal.present();
  }
}
