import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ModalController }                                   from '@ionic/angular';
import { IonContent }                                        from "@ionic/angular/standalone";
import { CommonModule }                                      from '@angular/common';
import { UserTagComponent }                                  from 'src/app/home/pages/company/pages/seat/pages/components/tags/user-tag/user-tag.component';
import { UserTagsService }                                   from 'src/app/shared/services/user-tags.service';
import { Observable, Subscription }                          from 'rxjs';

@Component({
  selector: 'app-select-friend-tag',
  templateUrl: './select-friend-tag.component.html',
  styleUrls: ['./select-friend-tag.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    UserTagComponent
  ]
})
export class SelectFriendTagComponent implements OnDestroy{
  @Output() updateUsersSelected: EventEmitter<any> = new EventEmitter();
  @Input() usersSelect: any[] = [];

  usersMergedData: any[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private modalController: ModalController,
    private userTagsService: UserTagsService
  ) {}

  ngOnInit() {
    this.autoSubscribe(this.userTagsService.getUsersMergedData(), v => {
      this.usersMergedData = v.map(user => ({
        ...user,
        userSelected: this.usersSelect.some(u => u.userID === user.userID)
      }));
    });
  }

  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  close() {
    this.modalController.dismiss(this.usersSelect)
  }

  selectUserTag(event: any) {
    const userID = event.user.userID;

    if (event.type) {
      if (!this.usersSelect.some(u => u.userID === userID)) {
        this.usersSelect.push(event.user);
      }

      const mergedUser = this.usersMergedData.find(u => u.userID === userID);
      if (mergedUser) {
        mergedUser.userSelected = true;
      }
    } else {
      this.usersSelect = this.usersSelect.filter(u => u.userID !== userID);

      const mergedUser = this.usersMergedData.find(u => u.userID === userID);
      if (mergedUser) {
        mergedUser.userSelected = false;
      }
    }
  }




}
