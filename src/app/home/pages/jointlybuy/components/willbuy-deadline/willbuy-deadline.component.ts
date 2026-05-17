import { CommonModule }                                             from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { Willbuy }                                                  from 'src/app/shared/interfaces/jointlybuy/willbuy';
import { Observable, Subscription }                                 from 'rxjs';
import { JointlybuyService }                                        from 'src/app/shared/services/jointlybuy.service';
import { WillbuyCardComponent }                                     from '../willbuy-card/willbuy-card.component';
import { RouterLink }                                               from '@angular/router';

@Component({
  selector: 'app-willbuy-deadline',
  templateUrl: './willbuy-deadline.component.html',
  styleUrls: ['./willbuy-deadline.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    WillbuyCardComponent,
    RouterLink
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WillbuyDeadlineComponent {
  @ViewChild('swiperWillbuyExpiring') swiperWillbuyExpiring?: ElementRef;

  willbuys: Willbuy[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private jointlybuyService: JointlybuyService
  ) {
    this.autoSubscribe(this.jointlybuyService.allWillbuyDeadline(), v => this.willbuys = v);
  }
  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }
  ngAfterViewInit() {
    if (this.swiperWillbuyExpiring) {
      const swiperEl = this.swiperWillbuyExpiring.nativeElement;
      Object.assign(swiperEl, {
        slidesPerView: 'auto',
        spaceBetween: 8,
      });
      swiperEl.initialize();
    }
  }
}
