import { CommonModule }                 from '@angular/common';
import { Component }                    from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Observable, Subscription }     from 'rxjs';
import { SocialSummary }                from 'src/app/shared/interfaces/multiple-profile-business/social-summary';
import { SocialService }                from 'src/app/shared/services/social.service';

@Component({
  selector: 'app-header-modal',
  templateUrl: './header-modal.component.html',
  styleUrls: ['./header-modal.component.scss'],
  imports: [
    IonicModule,
    CommonModule
  ],
  standalone: true
})
export class HeaderModalComponent {

  subscriptions: Subscription[] = [];
  seat: SocialSummary = {} as SocialSummary;
  constructor(
    private modalCtrl: ModalController,
    private socialService: SocialService
  ) {
    this.autoSubscribe(this.socialService.seatObservable, v => this.seat = v);
  }
  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  back() {
    this.modalCtrl.dismiss();
  }

}
