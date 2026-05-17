import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcceptAtmSuccessfullyComponent } from './accept-atm-successfully.component';

describe('AcceptAtmSuccessfullyComponent', () => {
  let component: AcceptAtmSuccessfullyComponent;
  let fixture: ComponentFixture<AcceptAtmSuccessfullyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptAtmSuccessfullyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcceptAtmSuccessfullyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
