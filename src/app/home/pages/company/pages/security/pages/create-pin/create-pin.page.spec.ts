import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePinPage } from './create-pin.page';

describe('CreatePinPage', () => {
  let component: CreatePinPage;
  let fixture: ComponentFixture<CreatePinPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CreatePinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
