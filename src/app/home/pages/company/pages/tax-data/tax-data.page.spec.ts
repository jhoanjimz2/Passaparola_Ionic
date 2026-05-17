import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxDataPage } from './tax-data.page';

describe('TaxDataPage', () => {
  let component: TaxDataPage;
  let fixture: ComponentFixture<TaxDataPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TaxDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
