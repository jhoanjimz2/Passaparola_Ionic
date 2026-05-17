import { Component, Input, OnInit } from '@angular/core';

import { SummaryCommunity } from 'src/app/shared/interfaces/community/summary-friends.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { CommunityService, UserService } from 'src/app/shared/services';
import { Friend } from '../../interfaces/friend.interfaces';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit {
  @Input() summaryCommunity: SummaryCommunity = {} as SummaryCommunity;
  users: User[] = [];
  userIds: string[] = [];
  friends: Friend[] = [];
  sumariesFriends: SummaryCommunity[] = [];
  month = 0;
  year = 0;

  constructor(
    private userService: UserService,
    private communityService: CommunityService
  ) {}

  ngOnInit() {
    this.userIds = this.summaryCommunity.myFriends.map(
      (friend) => friend.userId
    );
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers(this.userIds).subscribe({
      next: (response) => {
        this.users = response;
        this.getSummaryCommunityByUserIds(
          this.userIds,
          this.summaryCommunity.countryCode
        );
      },
    });
  }

  getSummaryCommunityByUserIds(userIds: string[], countryCode: string) {
    this.communityService
      .getSummaryCommunityByUserIds(userIds, countryCode, this.month, this.year)
      .subscribe({
        next: (response) => {
          this.sumariesFriends = response;
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
  }
}
