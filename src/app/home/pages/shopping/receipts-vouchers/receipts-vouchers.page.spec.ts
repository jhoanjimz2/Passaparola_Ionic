import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReceiptsVouchersPage } from './receipts-vouchers.page';

describe('ReceiptsVouchersPage', () => {
  let component: ReceiptsVouchersPage;
  let fixture: ComponentFixture<ReceiptsVouchersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReceiptsVouchersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
