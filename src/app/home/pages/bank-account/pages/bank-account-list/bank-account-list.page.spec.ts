import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankAccountListPage } from './bank-account-list.page';

describe('BankAccountListPage', () => {
  let component: BankAccountListPage;
  let fixture: ComponentFixture<BankAccountListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BankAccountListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
