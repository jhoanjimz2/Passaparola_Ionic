import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NavController } from '@ionic/angular';

import { SummaryCommunity } from 'src/app/shared/interfaces/community/summary-friends.interface';
import { Country } from 'src/app/shared/interfaces/country/country.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { WorldRewardPoints } from 'src/app/shared/interfaces/wallet/world-reward-points.interface';
import { CommunityService, CountryService } from 'src/app/shared/services';

interface CommunityCard {
  country: string;
  countryCode: string;
  totalMenbers: number;
  atm: number;
  showAtm: boolean;
}

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityComponent implements OnInit, OnDestroy {
  showAmount = true;
  user: User = {} as User;
  countries: Country[] = [];
  communities: CommunityCard[] = [];
  summaryCommunity: SummaryCommunity[] = [];
  month = 0;
  year = 0;
  worldRewardPoints: WorldRewardPoints[] = [];
  community: SummaryCommunity = {} as SummaryCommunity;
  @Input() refresh: any;

  constructor(
    private navController: NavController,
    private countryService: CountryService,
    private communityService: CommunityService // private walletService: WalletService
  ) {}
  ngOnDestroy(): void {}

  ngOnInit() {
    const user = localStorage.getItem('appPassaparola_user');
    this.user = JSON.parse(user!);
    this.communities = [];
    this.getCountries();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refresh']) {
      this.communities = [];
      this.getCountries();
    }
  }

  getCountries() {
    this.countryService.findAll().subscribe({
      next: (response) => {
        this.countries = response;
        this.getSummaryCommunityByCountry();
      },
    });
  }

  getSummaryCommunityByCountry() {
    this.communityService
      // .findSummaryCommunityByCountry('IT00000000000001', this.month, this.year)
      .findSummaryCommunityByCountry(this.user.userID!, this.month, this.year)
      .subscribe({
        next: (response) => {
          this.summaryCommunity = response;
          this.getDataCommunities();
        },
      });
  }

  getDataCommunities() {
    this.summaryCommunity.forEach((summary) => {
      this.communities.push({
        country: summary.country,
        countryCode: summary.countryCode,
        totalMenbers: summary.communityFriends,
        atm: summary.earnings ? summary.earnings : 0,
        showAtm: true,
      });
    });
    this.sortCommunities();
    this.community = this.summaryCommunity.find(
      (community) => community.countryCode === this.user.countryCode
    )!;
  }

  sortCommunities() {
    this.communities.sort((a, b) => b.totalMenbers - a.totalMenbers);
  }

  goToCommunity() {
    this.navController.navigateRoot(['community']);
  }

  // findWorldRewardPointsByCountry(contryCode: string) {
  //   this.walletService.findWorldRewardPointsByCountry(contryCode).subscribe({
  //     next: (response) => {
  //       this.worldRewardPoints = response.filter((item) => item.level > 0);
  //       this.getFriendsByLevel();
  //       this.getEarnings();
  //     },
  //   });
  // }

  // getFriendsByLevel() {
  //   let i = 0;
  //   this.worldRewardPoints.forEach((world) => {
  //     const friends = this.community.myFriends.filter(
  //       (friend) => friend.worldRewardPoints.level === world.level
  //     );
  //     this.worldRewardPoints[i].friendsBylevel = friends;
  //     i++;
  //   });
  // }

  // getEarnings() {
  //   let i = 0;
  //   this.worldRewardPoints.forEach((world) => {
  //     const friends = this.community.myFriends.filter(
  //       (friend) => friend.worldRewardPoints.level === world.level
  //     );
  //     this.worldRewardPoints[i].earnings = friends.reduce(
  //       (a, b) => a + b.earnings,
  //       0
  //     );
  //     i++;
  //   });
  // }
}
