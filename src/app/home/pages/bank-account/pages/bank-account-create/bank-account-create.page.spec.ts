import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankAccountCreatePage } from './bank-account-create.page';

describe('BankAccountCreatePage', () => {
  let component: BankAccountCreatePage;
  let fixture: ComponentFixture<BankAccountCreatePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BankAccountCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
