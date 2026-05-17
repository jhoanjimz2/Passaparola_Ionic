import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SlidesPaymentMethodsComponent } from './slides-payment-methods.component';

describe('SlidesPaymentMethodsComponent', () => {
  let component: SlidesPaymentMethodsComponent;
  let fixture: ComponentFixture<SlidesPaymentMethodsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidesPaymentMethodsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SlidesPaymentMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
