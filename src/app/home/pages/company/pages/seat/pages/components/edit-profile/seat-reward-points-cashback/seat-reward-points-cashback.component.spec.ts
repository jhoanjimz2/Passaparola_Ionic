import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeatRewardPointsCashbackComponent } from './seat-reward-points-cashback.component';

describe('SeatRewardPointsCashbackComponent', () => {
  let component: SeatRewardPointsCashbackComponent;
  let fixture: ComponentFixture<SeatRewardPointsCashbackComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SeatRewardPointsCashbackComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SeatRewardPointsCashbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
