import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewWillbuysDeadlinePage } from './view-willbuys-deadline.page';

describe('ViewWillbuysDeadlinePage', () => {
  let component: ViewWillbuysDeadlinePage;
  let fixture: ComponentFixture<ViewWillbuysDeadlinePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewWillbuysDeadlinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
