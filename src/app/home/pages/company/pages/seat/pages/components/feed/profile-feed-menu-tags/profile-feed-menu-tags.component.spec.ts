import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileFeedMenuTagsComponent } from './profile-feed-menu-tags.component';

describe('ProfileFeedMenuTagsComponent', () => {
  let component: ProfileFeedMenuTagsComponent;
  let fixture: ComponentFixture<ProfileFeedMenuTagsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileFeedMenuTagsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileFeedMenuTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
