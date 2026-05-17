import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankCardListPage } from './bank-card-list.page';

describe('BankCardListPage', () => {
  let component: BankCardListPage;
  let fixture: ComponentFixture<BankCardListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BankCardListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
