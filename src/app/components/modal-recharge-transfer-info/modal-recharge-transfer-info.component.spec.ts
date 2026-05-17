import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalRechargeTransferInfoComponent } from './modal-recharge-transfer-info.component';

describe('ModalRechargeTransferInfoComponent', () => {
  let component: ModalRechargeTransferInfoComponent;
  let fixture: ComponentFixture<ModalRechargeTransferInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRechargeTransferInfoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalRechargeTransferInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
