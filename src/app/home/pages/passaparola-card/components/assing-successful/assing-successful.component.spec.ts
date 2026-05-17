import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssingSuccessfulComponent } from './assing-successful.component';

describe('AssingSuccessfulComponent', () => {
  let component: AssingSuccessfulComponent;
  let fixture: ComponentFixture<AssingSuccessfulComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssingSuccessfulComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssingSuccessfulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
