import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdentityVerificationPage } from './identity-verification.page';

describe('IdentityVerificationPage', () => {
  let component: IdentityVerificationPage;
  let fixture: ComponentFixture<IdentityVerificationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityVerificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
