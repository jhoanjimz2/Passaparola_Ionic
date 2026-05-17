import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvestimentiPage } from './investimenti.page';

describe('InvestimentiPage', () => {
  let component: InvestimentiPage;
  let fixture: ComponentFixture<InvestimentiPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InvestimentiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
