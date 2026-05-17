import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankCardCreatePage } from './bank-card-create.page';

describe('BankCardCreatePage', () => {
  let component: BankCardCreatePage;
  let fixture: ComponentFixture<BankCardCreatePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BankCardCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
