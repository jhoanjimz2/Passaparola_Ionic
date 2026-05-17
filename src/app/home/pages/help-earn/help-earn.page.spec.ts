import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpEarnPage } from './help-earn.page';

describe('HelpEarnPage', () => {
  let component: HelpEarnPage;
  let fixture: ComponentFixture<HelpEarnPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HelpEarnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
