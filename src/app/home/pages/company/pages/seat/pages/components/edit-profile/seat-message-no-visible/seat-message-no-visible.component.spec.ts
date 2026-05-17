import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SeatMessageNoVisibleComponent } from './seat-message-no-visible.component';

describe('SeatMessageNoVisibleComponent', () => {
  let component: SeatMessageNoVisibleComponent;
  let fixture: ComponentFixture<SeatMessageNoVisibleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SeatMessageNoVisibleComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(SeatMessageNoVisibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
