import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WillbuyDeadlineComponent } from './willbuy-deadline.component';

describe('WillbuyDeadlineComponent', () => {
  let component: WillbuyDeadlineComponent;
  let fixture: ComponentFixture<WillbuyDeadlineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WillbuyDeadlineComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WillbuyDeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
