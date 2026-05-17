import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromotionalMatPage } from './promotional-mat.page';

describe('PromotionalMatPage', () => {
  let component: PromotionalMatPage;
  let fixture: ComponentFixture<PromotionalMatPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PromotionalMatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
