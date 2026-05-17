import { Component, OnDestroy, OnInit }         from '@angular/core';
import { FormBuilder, FormControl, FormGroup }  from '@angular/forms';
import { ModalController }                      from '@ionic/angular';
import { Subscription }                         from 'rxjs';
import { Events }                               from 'src/app/shared/interfaces/events/events';
import { EventsService }                        from 'src/app/shared/services';
import { KeyboardService }                      from 'src/app/shared/services/keyboard.service';
import { required }                             from 'src/app/shared/validators/events.validator';

@Component({
  selector: 'app-seat-tags',
  templateUrl: './seat-tags.component.html',
  styleUrls: ['./seat-tags.component.scss'],
})
export class SeatTagsComponent  implements OnInit, OnDestroy {
  filteredSuggestedTags: any = [];
  showSearch = false;

  form: FormGroup = this.fb.group({
    search: new FormControl('', [ required()] ),
  });
  maxTags: number = 10;

  private subscription!: Subscription;
  private subscription2!: Subscription;
  eventProfile: Events = {} as Events;
  suggestedTags: string[] = [];

  isKeyboardOpen = false;
  private keyboardSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService,
    private modalController: ModalController,
    private keyboardService: KeyboardService
  ) {
    this.subscription = this.eventsService.obtenerEventSelect().subscribe({
      next: (event) => { this.eventProfile = structuredClone(event); }
    });
    this.subscription2 = this.eventsService.obtenerAllTags().subscribe({
      next: (event) => { this.suggestedTags = event; }
    });
    this.keyboardSub = this.keyboardService.isKeyboardOpen$.subscribe(isOpen => {
      this.isKeyboardOpen = isOpen;
    });
  }
  ngOnInit() {
    if (!this.eventProfile.tags?.length) this.eventProfile.tags = [];

    this.filteredSuggestedTags = this.suggestedTags.filter((st: any) => {
      const tag = this.eventProfile.tags?.find(
        (t: any) => t.trim().toLowerCase() === st.trim().toLowerCase()
      );
      if (tag) return { ...st, checked: true };
    });

    this.filteredSuggestedTags.sort();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
    if (this.keyboardSub) this.keyboardSub.unsubscribe();
  }


  onSave() {
    this.eventsService.actualizarEvento({ tags: this.eventProfile.tags });
    this.modalController.dismiss();
  }
  seatTags() {
    this.eventsService.seatTags(this.eventProfile.id!,this.eventProfile.tags!).subscribe({ next:() => this.onSave() })
  }

  onPreventSubmit(event: any) {
    event.preventDefault();
  }
  onKeyUp(event: KeyboardEvent) {
    event.preventDefault();
    const searchString = this.form.get('search')?.value;
    if (event.key === 'Enter' && (!this.filteredSuggestedTags.length || !this.filteredSuggestedTags.includes(searchString.toLowerCase())))
      this.addTag(searchString);
    else this.filterSuggestedTags(searchString);
  }
  crea() {
    const searchString = this.form.get('search')?.value;
    if (!this.filteredSuggestedTags.length || !this.filteredSuggestedTags.includes(searchString.toLowerCase())) {
      this.addTag(searchString);
    } else {
      this.filterSuggestedTags(searchString);
    }
  }


  addTag(searchString: string) {
    this.eventProfile.tags?.push(searchString)
    this.suggestedTags.push(searchString);
    this.filteredSuggestedTags.push(searchString);

    this.filteredSuggestedTags.sort();
  }
  filterSuggestedTags(searchString: string) {
    const filteredData = this.suggestedTags.filter((item: any) =>
      item.toLowerCase().includes(searchString.toLowerCase())
    );

    this.filteredSuggestedTags = filteredData;
  }
  deleteSelectedSelectedTags(tag: any) {
    const currentEvent = this.eventProfile.tags;
    const nuevaListaTags = currentEvent!.filter(t => t !== tag);
    this.eventProfile.tags = [...nuevaListaTags]
    this.filteredSuggestedTags = [...this.filteredSuggestedTags];
  }
  findSuggestedTags(tagSelected: any) {
    for (const selectedTag of this.eventProfile.tags!) {
      for (const tag of this.filteredSuggestedTags) {
        if (
          tag.trim().toLowerCase() === tagSelected.trim().toLowerCase() &&
          selectedTag.trim().toLowerCase() === tagSelected.trim().toLowerCase()
        ) {
          return true;
        }
      }
    }
    return false;
  }
  updateChecked(event: any, tag: any) {
    if (this.eventProfile.tags!.length >= this.maxTags) {
      this.deleteSelectedSelectedTags(tag);
      event.target.checked = false;
    } else if (event.detail.checked) {
      this.eventProfile.tags?.push(tag)
    }
    else this.deleteSelectedSelectedTags(tag);
  }

  onCancel() {
    this.modalController.dismiss();
  }

}
