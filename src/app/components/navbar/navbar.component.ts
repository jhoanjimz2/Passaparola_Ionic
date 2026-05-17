import { Component, OnDestroy, OnInit }        from '@angular/core';
import { Browser }                             from '@capacitor/browser';
import { SessionService, UserRole }            from 'src/app/shared/services/session.service';
import { environment }                         from 'src/environments/environment';

const NAVBAR_OPTIONS: Record<UserRole, any[]> = {
  user: [
    { icon: 'home-outline',                  url: 'social',          color: '#000000'},
    { icon: 'passaparola-mall',              url: 'main',            color: '#FE8C0F'},
    { icon: 'passaparola-map',               url: 'map',             color: '#00B1FF'},
    // { icon: 'passaparola-professionals',     url: 'professionals',   color: '#000000'},
    { icon: 'grid-outline',                  url: 'external-stores', color: '#35C93F'},
    { icon: 'passaparola-wallet-outline',    url: 'wallet',          color: '#3CC3A2'},
    { icon: 'passaparola-community-outline', url: 'community',       color: '#8C54FF'}
  ],
  professional_administrative: [
    { icon: 'passaparola-wallet-outline',    url: 'wallet',          color: '#3CC3A2'},
    { icon: 'passaparola-community-outline', url: 'community',       color: '#8C54FF'}
  ],
  professional_public: [
    { icon: 'passaparola-tpv',               url: 'tpv',             color: '#000000'},
    { icon: 'home-outline',                  url: 'social',          color: '#000000'},
    { icon: 'passaparola-mall',              url: 'main',            color: '#FE8C0F'},
    { icon: 'passaparola-map',               url: 'map',             color: '#00B1FF'},
    // { icon: 'passaparola-professionals',     url: 'professionals',   color: '#000000'},
    { icon: 'grid-outline',                  url: 'external-stores', color: '#35C93F'},
    { icon: 'passaparola-wallet-outline',    url: 'wallet',          color: '#3CC3A2'},
    { icon: 'passaparola-community-outline', url: 'community',       color: '#8C54FF'}
  ],
  company_operative: [
    { icon: 'passaparola-tpv',               url: 'tpv',             color: '#000000'},
    { icon: 'passaparola-recharges',         url: 'recharges',       color: '#000000'},
    { icon: 'home-outline',                  url: 'social',          color: '#000000'}
  ],
  company_legal: [
    { icon: 'passaparola-mall',              url: 'main',            color: '#FE8C0F'},
    { icon: 'passaparola-map',               url: 'map',             color: '#00B1FF'},
    // { icon: 'passaparola-professionals',     url: 'professionals',   color: '#000000'},
    { icon: 'grid-outline',                  url: 'external-stores', color: '#35C93F'},
    { icon: 'passaparola-wallet-outline',    url: 'wallet',          color: '#3CC3A2'},
    { icon: 'passaparola-community-outline', url: 'community',       color: '#8C54FF'}
  ],
};

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  page = '';
  options: any[] = [];

  constructor(public sessionService: SessionService) {
    const role: UserRole = this.sessionService.sede;
    this.options = NAVBAR_OPTIONS[role] || [];
  }
  ngOnDestroy(): void {
  }

  ngOnInit() {}

  async openStore() {
    await Browser.open({ url: environment.urlMall });
  }
}
