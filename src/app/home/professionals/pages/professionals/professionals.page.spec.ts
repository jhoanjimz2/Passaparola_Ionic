import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessionalsPage } from './professionals.page';

describe('ProfessionalsPage', () => {
  let component: ProfessionalsPage;
  let fixture: ComponentFixture<ProfessionalsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
