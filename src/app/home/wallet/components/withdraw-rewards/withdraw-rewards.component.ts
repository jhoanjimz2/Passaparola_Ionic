import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ModalStartAppComponent } from 'src/app/components/modal-start-app/modal-start-app.component';
import { CommunityDetailComponent } from 'src/app/home/community/components/community-detail/community-detail.component';
import { SummaryCommunity } from 'src/app/shared/interfaces/community/summary-friends.interface';
import { Country } from 'src/app/shared/interfaces/country/country.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { Wallet } from 'src/app/shared/interfaces/wallet/wallet.interface';
import { WithdrawReward } from 'src/app/shared/interfaces/wallet/withdraw-reward.interface';
import {
  CommunityService,
  CountryService,
  WalletService,
} from 'src/app/shared/services';

interface CommunityCard {
  country: string;
  countryCode: string;
  totalMenbers: number;
  atm: number;
  showAtm: boolean;
}

@Component({
  selector: 'app-withdraw-rewards',
  templateUrl: './withdraw-rewards.component.html',
  styleUrls: ['./withdraw-rewards.component.scss'],
})
export class WithdrawRewardsComponent implements OnInit {
  user: User = {} as User;
  countries: Country[] = [];
  communities: CommunityCard[] = [];
  summaryCommunity: SummaryCommunity[] = [];
  month = 0;
  year = 0;
  loading = false;
  withdrawRewards: WithdrawReward[] = [];
  walletTo: Wallet | undefined;

  constructor(
    private modalController: ModalController,
    private countryService: CountryService,
    private communityService: CommunityService,
    private walletService: WalletService
  ) {}

  ngOnInit() {
    const user = localStorage.getItem('appPassaparola_user');
    this.user = JSON.parse(user!);
    const wallet = localStorage.getItem('walletSelected');
    this.walletTo = JSON.parse(wallet!);
    this.communities = [];

    this.checkWithdrawReward();
  }

  checkWithdrawReward() {
    this.walletService.checkWithdrawReward().subscribe({
      next: (response) => {
        this.withdrawRewards = response.withdrawRewards;
        this.year = response.year;
        this.month = response.month;
        this.communities = [];
        this.getCountries();
      },
    });
  }

  withdrawReward(community: CommunityCard) {
    const requets: WithdrawReward = {
      userId: this.user.userID!,
      status: true,
      walletTo: this.walletTo?.id!,
      amount: community.atm,
      countryCode: community.countryCode,
    };
    this.walletService.createWithdrawReward(requets).subscribe({
      next: (response) => {
        this.checkWithdrawReward();
      },
      error: (error) => {
        console.error('Error withdrawing reward:', error);
      },
    });
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.communities = [];
      this.getSummaryCommunityByCountry();
      event.target.complete();
    }, 1000);
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
    this.loading = true;
    this.communityService
      // .findSummaryCommunityByCountry('IT00000000000001', this.month, this.year)
      .findSummaryCommunityByCountry(this.user.userID!, this.month, this.year)
      .subscribe({
        next: (response) => {
          this.summaryCommunity = response;
          this.getDataCommunities();
        },
        complete: () => (this.loading = false),
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
  }

  async modalInfo() {
    const modal = await this.modalController.create({
      component: ModalStartAppComponent,
      cssClass: 'modal-60vh',
      backdropDismiss: true,
    });
    await modal.present();
  }

  async modalDetail(countryCode: string) {
    const summaryCommunity = this.summaryCommunity.find(
      (summary) => summary.countryCode === countryCode
    );

    if (summaryCommunity?.friends === 0) return;

    const modal = await this.modalController.create({
      component: CommunityDetailComponent,
      cssClass: 'modal-full-screen',
      backdropDismiss: true,
      componentProps: { summaryCommunity },
    });
    await modal.present();
  }

  sortCommunities() {
    this.communities.sort((a, b) => b.totalMenbers - a.totalMenbers);
  }

  checkWithdrawRewardByCountryCode(countryCode: string) {
    const withdrawReward = this.withdrawRewards.find(
      (withdraw) => withdraw.countryCode === countryCode
    );

    return withdrawReward ? true : false;
  }
}
