import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventSuggestedPage } from './event-suggested.page';

describe('EventSuggestedPage', () => {
  let component: EventSuggestedPage;
  let fixture: ComponentFixture<EventSuggestedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EventSuggestedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
