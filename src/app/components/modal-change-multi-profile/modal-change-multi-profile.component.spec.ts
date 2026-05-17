import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalChangeMultiProfileComponent } from './modal-change-multi-profile.component';

describe('ModalChangeMultiProfileComponent', () => {
  let component: ModalChangeMultiProfileComponent;
  let fixture: ComponentFixture<ModalChangeMultiProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalChangeMultiProfileComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalChangeMultiProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
