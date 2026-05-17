import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransferSuccessfullyComponent } from './transfer-successfully.component';

describe('TransferSuccessfullyComponent', () => {
  let component: TransferSuccessfullyComponent;
  let fixture: ComponentFixture<TransferSuccessfullyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferSuccessfullyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransferSuccessfullyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
