import { CommonModule }                                             from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { RouterLink }                                               from '@angular/router';
import { Observable, Subscription }                                 from 'rxjs';
import { CategoryWillbuy }                                          from 'src/app/shared/interfaces/jointlybuy/category';
import { JointlybuyService }                                        from 'src/app/shared/services/jointlybuy.service';

@Component({
  selector: 'app-slide-category',
  templateUrl: './slide-category.component.html',
  styleUrls: ['./slide-category.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SlideCategoryComponent {
  @ViewChild('swiperCategoryJointlybuy') swiperCategoryJointlybuy?: ElementRef;

  categories: CategoryWillbuy[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private jointlybuyService: JointlybuyService
  ) {
    this.autoSubscribe(this.jointlybuyService.allCategoryWillbuy(), v => this.categories = v);
  }
  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


  ngAfterViewInit() {
    if (this.swiperCategoryJointlybuy) {
      const swiperEl = this.swiperCategoryJointlybuy.nativeElement;
      Object.assign(swiperEl, {
        slidesPerView: 'auto',
        spaceBetween: 8,
      });
      swiperEl.initialize();
    }
  }
}
