import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayCartPage } from './pay-cart.page';

describe('PayCartPage', () => {
  let component: PayCartPage;
  let fixture: ComponentFixture<PayCartPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PayCartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
