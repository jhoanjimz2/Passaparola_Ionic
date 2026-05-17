import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PassaparolaCardPage } from './passaparola-card.page';

describe('PassaparolaCardPage', () => {
  let component: PassaparolaCardPage;
  let fixture: ComponentFixture<PassaparolaCardPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PassaparolaCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
