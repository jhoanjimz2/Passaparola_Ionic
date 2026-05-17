import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BsVoteAndWinComponent } from './bs-vote-and-win.component';

describe('BsVoteAndWinComponent', () => {
  let component: BsVoteAndWinComponent;
  let fixture: ComponentFixture<BsVoteAndWinComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BsVoteAndWinComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BsVoteAndWinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
