import { Component, Input, OnInit } from '@angular/core';

import {
  MyFriend,
  SummaryCommunity,
} from 'src/app/shared/interfaces/community/summary-friends.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { CommunityService, UserService } from 'src/app/shared/services';
import { Friend } from '../../interfaces/friend.interfaces';
import { WorldRewardPoints } from 'src/app/shared/interfaces/wallet/world-reward-points.interface';

@Component({
  selector: 'app-friends-by-level',
  templateUrl: './friends-by-level.component.html',
  styleUrls: ['./friends-by-level.component.scss'],
})
export class FriendsByLevelComponent implements OnInit {
  @Input() summaryCommunity: SummaryCommunity = {} as SummaryCommunity;
  users: User[] = [];
  userIds: string[] = [];
  friends: Friend[] = [];
  sumariesFriends: SummaryCommunity[] = [];
  @Input() worldRewardPoints: WorldRewardPoints = {} as WorldRewardPoints;

  constructor(
    private userService: UserService,
    private communityService: CommunityService
  ) {}

  ngOnInit() {
    this.sumariesFriends = this.summaryCommunity.myFriends.filter(
      (friend) =>
        friend.worldRewardPoints.level === this.worldRewardPoints.level
    );
    this.userIds = this.sumariesFriends.map((friend) => friend.userId!);
    if (this.userIds.length > 0) this.getUsers();
  }

  getUsers() {
    this.userService.getUsers(this.userIds).subscribe({
      next: (response) => {
        this.users = response;
        // this.getSummaryCommunityByUserIds(
        //   this.userIds,
        //   this.summaryCommunity.countryCode
        // );
        this.getFriends();
      },
    });
  }

  getSummaryCommunityByUserIds(userIds: string[], countryCode: string) {
    this.communityService
      .getSummaryCommunityByUserIds(userIds, countryCode, 0, 0)
      .subscribe({
        next: (response) => {
          this.sumariesFriends = response.filter(
            (sumary) =>
              sumary.worldRewardPoints?.level === this.worldRewardPoints.level
          );
          this.getFriends();
        },
      });
  }

  getFriends() {
    this.users.forEach((user) => {
      this.sumariesFriends.forEach((summary) => {
        if (summary.userId === user.userID) {
          this.friends.push({
            name: user.profile?.name + ' ' + user.profile?.lastName,
            date: this.formatDate(user.createdAt!),
            img: user.profile?.profilePictureUrlFile!,
            summary,
            user,
            earnings: 0,
          });
        }
      });
    });
    this.getEarnings();
  }

  formatDate(date: string) {
    if (!date) return '';
    const arrayDate1 = date.split('T');
    const arrayDate2 = arrayDate1[0].split('-');
    const dateFormat = `${arrayDate2[2]}/${arrayDate2[1]}/${arrayDate2[0]}`;
    return dateFormat;
  }

  getEarnings() {
    let i = 0;
    this.friends.forEach((friend) => {
      this.summaryCommunity.myFriends.forEach((myFriend) => {
        if (friend.summary.userId === myFriend.userId)
          this.friends[i].earnings = myFriend.earnings;
      });
      i++;
    });

    // this.friends.forEach((friend) => {
    //   this.sumariesFriends.forEach((item) => {
    //     if (friend.summary.userId === item.userId) {
    //       const dPercentage =
    //         this.summaryCommunity.worldRewardPoints?.percentage! -
    //         this.worldRewardPoints.percentage;

    //       const earnings = (item.rewardPoints * dPercentage) / 100;

    //       friend.earnings = earnings;
    //       item.earnings = earnings;
    //     }
    //   });
    // });
  }
}
