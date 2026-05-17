import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectLoginProfessionalsComponent } from './select-login-professionals.component';

describe('SelectLoginProfessionalsComponent', () => {
  let component: SelectLoginProfessionalsComponent;
  let fixture: ComponentFixture<SelectLoginProfessionalsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectLoginProfessionalsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectLoginProfessionalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
