import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyEventsOrganizatedComponent } from './my-events-organizated.component';

describe('MyEventsOrganizatedComponent', () => {
  let component: MyEventsOrganizatedComponent;
  let fixture: ComponentFixture<MyEventsOrganizatedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyEventsOrganizatedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyEventsOrganizatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
