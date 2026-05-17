import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNFCPage } from './add-nfc.page';

describe('AddNFCPage', () => {
  let component: AddNFCPage;
  let fixture: ComponentFixture<AddNFCPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddNFCPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
