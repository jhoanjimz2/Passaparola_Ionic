import { CommonModule }                           from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule }                            from '@ionic/angular';

@Component({
  selector: 'app-tabs-profile',
  templateUrl: './tabs-profile.component.html',
  styleUrls: ['./tabs-profile.component.scss'],
  imports: [
    IonicModule,
    CommonModule
  ],
  standalone: true,
})
export class TabsProfileComponent {
  @Output() selectTab: EventEmitter<string> = new EventEmitter<string>();
  @Input() isPublic: boolean = false;
  @Input() tab!: string;

  setTab(tab: string) {
    this.selectTab.emit(tab)
  }
}
