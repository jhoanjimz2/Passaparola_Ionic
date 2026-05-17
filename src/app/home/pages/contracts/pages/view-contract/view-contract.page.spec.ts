import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewContractPage } from './view-contract.page';

describe('ViewContractPage', () => {
  let component: ViewContractPage;
  let fixture: ComponentFixture<ViewContractPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewContractPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
