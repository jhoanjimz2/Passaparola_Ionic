import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BsAddressOnTheMapComponent } from './bs-address-on-the-map.component';

describe('BsAddressOnTheMapComponent', () => {
  let component: BsAddressOnTheMapComponent;
  let fixture: ComponentFixture<BsAddressOnTheMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BsAddressOnTheMapComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BsAddressOnTheMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
