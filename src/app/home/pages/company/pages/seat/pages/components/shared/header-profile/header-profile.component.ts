import { CommonModule }                           from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon }                                from '@ionic/angular/standalone';
import { TranslateModule }                        from '@ngx-translate/core';
import { Observable, Subscription }               from 'rxjs';
import { SocialSummary }                          from 'src/app/shared/interfaces/multiple-profile-business/social-summary';
import { FormattNumberPipe }                      from 'src/app/shared/pipes';
import { BusinessStatusPipe }                     from 'src/app/shared/pipes/business-status.pipe';
import { NumberFormatPipe }                       from 'src/app/shared/pipes/number-format.pipe';
import { SessionService }                         from 'src/app/shared/services/session.service';
import { SocialService }                          from 'src/app/shared/services/social.service';

@Component({
  selector: 'app-header-profile',
  templateUrl: './header-profile.component.html',
  styleUrls: ['./header-profile.component.scss'],
  imports: [
    CommonModule,
    FormattNumberPipe,
    BusinessStatusPipe,
    TranslateModule,
    IonIcon,
    NumberFormatPipe
],
  standalone: true,
})
export class HeaderProfileComponent {
  @Output() clickButton: EventEmitter<string> = new EventEmitter<string>();
  @Output() editButton: EventEmitter<string> = new EventEmitter<string>();
  @Input() tab!: string;
  @Input() followers: any[] = [];
  @Input() mutual: any[] = [];
  @Input() isPublic: boolean = false;

  expanded = false;

  subscriptions: Subscription[] = [];
  seat: SocialSummary = {} as SocialSummary;
  statusFollow: boolean = true;
  showDetail: boolean = true;

  constructor(
    private socialService: SocialService,
    public sessionService: SessionService
  ){
    this.autoSubscribe(this.socialService.statusFollowObservable, v => this.statusFollow = v);
    this.autoSubscribe(this.socialService.seatObservable, v => this.seat = v);
    this.autoSubscribe(this.socialService.showDetailObservable, v => this.showDetail = v);
  }
  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  toggleExpand(): void {
    if (!this.showDetail) return;
    this.expanded = !this.expanded;
  }
  chat() {
    this.clickButton.emit('chat');
  }
  following() {
    this.clickButton.emit('following');
  }
  followers_() {
    this.clickButton.emit('followers');
  }
  follow() {
    this.clickButton.emit('follow');
  }
  share() {
    this.clickButton.emit('share');
  }

  //Edit Button
  name() {
    if (this.showDetail) return;
    this.editButton.emit('name')
  }
  tags() {
    if (this.showDetail) return;
    this.editButton.emit('tags')
  }
  username() {
    if (this.showDetail) return;
    this.editButton.emit('username')
  }
  category() {
    if (this.showDetail) return;
    this.editButton.emit('category')
  }
  schedule() {
    if (this.showDetail) return;
    this.editButton.emit('schedule')
  }
  imgProfile() {
    if (this.showDetail) return;
    this.editButton.emit('img-profile')
  }
  cashback() {
    if (this.showDetail) return;
    this.editButton.emit('cashback')
  }
  location() {
    if (this.showDetail) return;
    this.editButton.emit('location')
  }
  webAddress() {
    if (this.showDetail) return;
    this.editButton.emit('web-address')
  }
  viewTagRequests() {
    if (this.showDetail) return;
    this.editButton.emit('tag-requests')
  }

}
