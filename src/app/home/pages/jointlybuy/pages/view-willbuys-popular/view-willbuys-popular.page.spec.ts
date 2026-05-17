import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewWillbuysPopularPage } from './view-willbuys-popular.page';

describe('ViewWillbuysPopularPage', () => {
  let component: ViewWillbuysPopularPage;
  let fixture: ComponentFixture<ViewWillbuysPopularPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewWillbuysPopularPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
