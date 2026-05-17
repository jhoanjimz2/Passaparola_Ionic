import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAddressPage } from './create-address.page';

describe('CreateAddressPage', () => {
  let component: CreateAddressPage;
  let fixture: ComponentFixture<CreateAddressPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreateAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
