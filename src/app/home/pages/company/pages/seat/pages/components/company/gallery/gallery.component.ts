import { CommonModule }                                                               from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output }             from '@angular/core';
import { IonicModule }                                                                from '@ionic/angular';
import { Observable, Subscription }                                                   from 'rxjs';
import { SocialService }                                                              from 'src/app/shared/services/social.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  imports: [
    IonicModule,
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true
})
export class GalleryComponent {
  @Output() viewAll: EventEmitter<string> = new EventEmitter<string>();
  @Input() gallery: string[] = [];


  subscriptions: Subscription[] = [];
  operativeMode: boolean = true;
  showDetail: boolean = true;

  constructor(
    private socialService: SocialService
  ){
    this.autoSubscribe(this.socialService.showDetailObservable, v => this.showDetail = v);
    this.autoSubscribe(this.socialService.operativeObservable, v => this.operativeMode = v);
  }
  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


  viewAllEvent() {
    this.viewAll.emit()
  }

}
