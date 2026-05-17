import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RechargeSuccesfullyComponent } from './recharge-succesfully.component';

describe('RechargeSuccesfullyComponent', () => {
  let component: RechargeSuccesfullyComponent;
  let fixture: ComponentFixture<RechargeSuccesfullyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RechargeSuccesfullyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RechargeSuccesfullyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
