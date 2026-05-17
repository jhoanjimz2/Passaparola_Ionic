import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewWillbuysCategoryPage } from './view-willbuys-category.page';

describe('ViewWillbuysCategoryPage', () => {
  let component: ViewWillbuysCategoryPage;
  let fixture: ComponentFixture<ViewWillbuysCategoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewWillbuysCategoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
