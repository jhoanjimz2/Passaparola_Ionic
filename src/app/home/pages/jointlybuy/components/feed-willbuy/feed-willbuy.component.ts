import { Component, Input, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { NgxMasonryComponent, NgxMasonryModule }                 from 'ngx-masonry';
import { debounceTime, Subject, takeUntil }                      from 'rxjs';
import { CommonModule }                                          from '@angular/common';
import { Willbuy }                                               from 'src/app/shared/interfaces/jointlybuy/willbuy';
import { WillbuyCardComponent }                                  from '../willbuy-card/willbuy-card.component';

@Component({
  selector: 'app-feed-willbuy',
  templateUrl: './feed-willbuy.component.html',
  styleUrls: ['./feed-willbuy.component.scss'],
  standalone: true,
  imports: [
    NgxMasonryModule,
    WillbuyCardComponent,
    CommonModule
  ]
})
export class FeedWillbuyComponent implements OnDestroy, AfterViewInit {
  @Input() title: string = '';
  @Input() willbuys: Willbuy[] = [];

  @ViewChild('masonry') masonry!: NgxMasonryComponent;

  private destroy$ = new Subject<void>();
  private layoutSubject$ = new Subject<void>();

  masonryOptions = {
    itemSelector: '.masonry-item',
    columnWidth: '.grid-sizer',
    percentPosition: true,
    horizontalOrder: true,
    imagesLoaded: true
  };

  constructor() {
    this.layoutSubject$
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => this.masonry?.layout());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.layoutSubject$.complete();
  }

  ngAfterViewInit() {
    this.triggerLayout();
  }
  public triggerLayout() {
    this.layoutSubject$.next();
  }
}
