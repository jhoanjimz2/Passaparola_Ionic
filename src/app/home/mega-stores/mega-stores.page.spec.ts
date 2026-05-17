import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MegaStoresPage } from './mega-stores.page';

describe('MegaStoresPage', () => {
  let component: MegaStoresPage;
  let fixture: ComponentFixture<MegaStoresPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MegaStoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
