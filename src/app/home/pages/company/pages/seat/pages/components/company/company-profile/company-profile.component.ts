import { CommonModule }                           from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule }                            from '@ionic/angular';
import { GalleryComponent }                       from '../gallery/gallery.component';
import { LocationComponent }                      from '../location/location.component';
import { MenuComponent }                          from '../menu/menu.component';
import { SocialSummary }                          from 'src/app/shared/interfaces/multiple-profile-business/social-summary';
import { SocialService }                          from 'src/app/shared/services/social.service';
import { Observable, Subscription }               from 'rxjs';
import { TranslateModule }                        from '@ngx-translate/core';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    GalleryComponent,
    LocationComponent,
    MenuComponent,
    TranslateModule
  ],
  standalone: true
})
export class CompanyProfileComponent {
  @Output() editButton: EventEmitter<string> = new EventEmitter<string>();
  @Input() isPublic: boolean = false;
  @Input() menus: any[] = [];

  expanded = false;

  subscriptions: Subscription[] = [];
  seat: SocialSummary = {} as SocialSummary;
  showDetail: boolean = true;

  constructor(
    private socialService: SocialService
  ){
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
    this.expanded = !this.expanded;
  }

  gallery() {
    if (this.showDetail) return;
    this.editButton.emit('gallery')
  }
  location() {
    if (this.showDetail) return;
    this.editButton.emit('location')
  }
  description() {
    if (this.showDetail) return;
    this.editButton.emit('description')
  }

}
