import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunityPageRoutingModule } from './community-routing.module';

import { CommunityPage } from './community.page';
import { CommunityDetailComponent } from './components/community-detail/community-detail.component';
import { ComponentModule } from 'src/app/components/component.module';
import { FriendsComponent } from './components/friends/friends.component';
import { TranslateModule } from '@ngx-translate/core';
import { FriendsByLevelComponent } from './components/friends-by-level/friends-by-level.component';
import { FormattNumberPipe } from 'src/app/shared/pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunityPageRoutingModule,
    ComponentModule,
    TranslateModule,
    FormattNumberPipe,
  ],
  declarations: [
    CommunityPage,
    CommunityDetailComponent,
    FriendsComponent,
    FriendsByLevelComponent,
  ],
})
export class CommunityPageModule {}
