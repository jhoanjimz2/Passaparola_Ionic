import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExternalStoresPage } from './external-stores.page';

describe('ExternalStoresPage', () => {
  let component: ExternalStoresPage;
  let fixture: ComponentFixture<ExternalStoresPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExternalStoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
