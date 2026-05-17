import { CommonModule }             from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule }              from '@ionic/angular';
import { HeaderModalComponent }     from '../../followers/header-modal/header-modal.component';
import { TabsFollowersComponent }   from '../../followers/tabs-followers/tabs-followers.component';
import { SearchbarComponent }       from '../../followers/searchbar/searchbar.component';
import { FollowerComponent }        from '../../followers/follower/follower.component';
import { FollowersService }         from 'src/app/shared/services/followers.service';
import { CacheService }             from 'src/app/shared/services/cache.service';

type TabType = 'common' | 'followers' | 'following';

interface LoadState {
  data: any[];
  total: number;
  limit: number;
  offset: number;
  isLoading: boolean;
  hasMore: boolean;
}

@Component({
  selector: 'app-external-followers-tabs',
  templateUrl: './external-followers-tabs.component.html',
  styleUrls: ['./external-followers-tabs.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    HeaderModalComponent,
    TabsFollowersComponent,
    SearchbarComponent,
    FollowerComponent
  ],
  standalone: true
})
export class ExternalFollowersTabsComponent implements OnInit {
  @Input() id!: string;
  @Input() tab: TabType = 'followers';
  activeTab: TabType = 'followers';

  states: Record<'followers' | 'following' | 'common', LoadState> = {
    followers: { data: [], total: 0, limit: 10, offset: 1, isLoading: false, hasMore: true },
    following: { data: [], total: 0, limit: 10, offset: 1, isLoading: false, hasMore: true },
    common:    { data: [], total: 0, limit: 10, offset: 1, isLoading: false, hasMore: true }
  };

  constructor(
    private followersService: FollowersService,
    private cacheService: CacheService
  ) {}

  ngOnInit() {
    this.activeTab = this.tab;

    // Intenta restaurar desde caché antes de hacer peticiones HTTP
    const restoredFollowers = this.restoreStateFromCache('followers');
    const restoredFollowing = this.restoreStateFromCache('following');
    const restoredCommon    = this.restoreStateFromCache('common');

    if (!restoredFollowers) this.loadData('followers', true);
    if (!restoredFollowing) this.loadData('following', true);
    if (!restoredCommon)    this.loadData('common', true);
  }

  /**
   * Restaura el estado de un tab desde caché si existe la página 1.
   * @returns true si se restauró desde caché, false si hay que cargar
   */
  private restoreStateFromCache(type: 'followers' | 'following' | 'common'): boolean {
    const cacheKey = `followers:${type}:${this.id}:p1`;
    const cached = this.cacheService.get<any>(cacheKey);
    if (!cached) return false;

    const state = this.states[type];
    state.data    = cached.data || [];
    state.total   = cached.metadata?.total ?? 0;
    state.offset  = 2; // página 1 ya cargada
    state.hasMore = (cached.data?.length || 0) >= state.limit;

    return true;
  }

  selectTab(tab: TabType) {
    this.activeTab = tab;
  }

  loadMore(event: any, type: 'followers' | 'following' | 'common') {
    this.loadData(type, false, event);
  }

  private loadData(type: 'followers' | 'following' | 'common', reset = false, event?: any) {
    const state = this.states[type];
    const serviceMethod = {
      followers: this.followersService.findAllFollowers.bind(this.followersService),
      following: this.followersService.findAllFollowing.bind(this.followersService),
      common:    this.followersService.findAllComune.bind(this.followersService)
    }[type];

    if (state.isLoading || (!state.hasMore && !reset)) {
      event?.target.complete?.();
      return;
    }

    if (reset) {
      state.offset  = 1;
      state.hasMore = true;
      state.data    = [];
    }

    state.isLoading = true;
    serviceMethod({ offset: state.offset, limit: state.limit }, this.id).subscribe({
      next: (response: any) => {
        const newData = response.data || [];
        state.data  = [...state.data, ...newData];
        state.total = response.metadata.total;

        if (newData.length < state.limit) {
          state.hasMore = false;
        } else {
          state.offset++;
        }

        state.isLoading = false;
        event?.target.complete?.();
      },
      error: () => {
        state.isLoading = false;
        event?.target.complete?.();
      }
    });
  }
}
