import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BsSuggestInformationStep1Component } from './bs-suggest-information-step1.component';

describe('BsSuggestInformationStep1Component', () => {
  let component: BsSuggestInformationStep1Component;
  let fixture: ComponentFixture<BsSuggestInformationStep1Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BsSuggestInformationStep1Component ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BsSuggestInformationStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
