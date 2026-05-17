import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AmountWithoutRewardsComponent } from './amount-without-rewards.component';

describe('AmountWithoutRewardsComponent', () => {
  let component: AmountWithoutRewardsComponent;
  let fixture: ComponentFixture<AmountWithoutRewardsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AmountWithoutRewardsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AmountWithoutRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
