import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RechargesPage } from './recharges.page';

describe('RechargesPage', () => {
  let component: RechargesPage;
  let fixture: ComponentFixture<RechargesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RechargesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
