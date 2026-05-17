import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransferRechargeSuccesfullyComponent } from './transfer-recharge-succesfully.component';

describe('TransferRechargeSuccesfullyComponent', () => {
  let component: TransferRechargeSuccesfullyComponent;
  let fixture: ComponentFixture<TransferRechargeSuccesfullyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferRechargeSuccesfullyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransferRechargeSuccesfullyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
