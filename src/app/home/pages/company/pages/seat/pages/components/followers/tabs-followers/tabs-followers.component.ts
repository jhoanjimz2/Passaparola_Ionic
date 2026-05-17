import { CommonModule }                           from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule }                            from '@ionic/angular';

@Component({
  selector: 'app-tabs-followers',
  templateUrl: './tabs-followers.component.html',
  styleUrls: ['./tabs-followers.component.scss'],
  imports: [
    IonicModule,
    CommonModule
  ],
  standalone: true
})
export class TabsFollowersComponent {
  @Output() selectTab: EventEmitter<'common' | 'followers' | 'following'> =
  new EventEmitter<'common' | 'followers' | 'following'>();

  @Input() activeTab: 'common' | 'followers' | 'following' = 'followers';
  @Input() common: boolean = false;

  @Input() totalComune: number = 0;
  @Input() totalFollowing: number = 0;
  @Input() totalFollowers: number = 0;

  setTab(tab: 'common' | 'followers' | 'following') {
    this.selectTab.emit(tab);
  }

}
