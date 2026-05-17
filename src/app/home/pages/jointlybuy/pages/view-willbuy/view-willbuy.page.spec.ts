import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewWillbuyPage } from './view-willbuy.page';

describe('ViewWillbuyPage', () => {
  let component: ViewWillbuyPage;
  let fixture: ComponentFixture<ViewWillbuyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewWillbuyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
