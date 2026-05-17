import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckCodePage } from './check-code.page';

describe('CheckCodePage', () => {
  let component: CheckCodePage;
  let fixture: ComponentFixture<CheckCodePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CheckCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
