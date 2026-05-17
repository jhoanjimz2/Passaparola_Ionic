import { CommonModule }                                      from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { IonIcon, IonText }                                  from "@ionic/angular/standalone";
import { SocialService }                                     from 'src/app/shared/services/social.service';

@Component({
  selector: 'app-user-tag',
  templateUrl: './user-tag.component.html',
  styleUrls: ['./user-tag.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    IonText
  ]
})
export class UserTagComponent  implements OnDestroy {
  @Output() selectUserTag: EventEmitter<any> = new EventEmitter();
  @Output() goUser: EventEmitter<any> = new EventEmitter();
  @Input() friendSelected: boolean = false;
  @Input() friendTag: boolean = false;
  @Input() user: any;

  statusFollow: boolean = false;

  constructor(
    private socialService: SocialService
  ) { }

  ngOnInit() {
    if( this.friendTag ) this.followStatus(false);
  }

  ngOnDestroy() {}

  select() {
    this.selectUserTag.emit({
      type: !this.user.userSelected,
      user: this.user
    })
  }

  deselect() {
    this.selectUserTag.emit({ user: this.user })
  }

  follow() {
    this.socialService.follow(this.user.id).subscribe({
      next: (data: any) => {
        this.followStatus(true);
      },
    });
  }

  private followStatus(showSpinner: boolean) {
    this.socialService.followStatus(this.user.id, showSpinner).subscribe({
      next: (data: any) => {
        this.statusFollow = data.isFollowing;
      },
    });
  }

  goUserClick() {
    this.goUser.emit()
  }

}
