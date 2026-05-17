import { Component }                 from '@angular/core';
import { ToastrService }             from 'ngx-toastr';
import { IonicModule }               from '@ionic/angular';
import { CommonModule }              from '@angular/common';
import { SocialSummary }             from 'src/app/shared/interfaces/multiple-profile-business/social-summary';
import { SocialService }             from 'src/app/shared/services/social.service';
import { Observable, Subscription }  from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  imports: [
    IonicModule,
    CommonModule
  ],
  standalone: true
})
export class ContactComponent {

  subscriptions: Subscription[] = [];
  seat: SocialSummary = {} as SocialSummary;
  constructor(
    private toastr: ToastrService,
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

  copyToClipboard(value: string): void {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      this.toastr.success('Copiato');
    }).catch(() => {
      this.toastr.error('Errore');
    });
  }

  goToWebsite(url: string): void {
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;
    }
    window.open(url, '_blank');
  }
}
