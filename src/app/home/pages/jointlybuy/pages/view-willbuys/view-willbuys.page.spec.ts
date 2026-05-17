import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewWillbuysPage } from './view-willbuys.page';

describe('ViewWillbuysPage', () => {
  let component: ViewWillbuysPage;
  let fixture: ComponentFixture<ViewWillbuysPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewWillbuysPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
