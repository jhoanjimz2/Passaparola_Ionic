import { Component, Input, OnDestroy, OnInit }                      from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators }            from '@angular/forms';
import { ModalController }                                          from '@ionic/angular';
import { Subscription }                                             from 'rxjs';
import { Events }                                                   from 'src/app/shared/interfaces/events/events';
import { EventsService }                                            from 'src/app/shared/services';
import { v4 as uuidv4 }                                             from 'uuid';

@Component({
  selector: 'app-seat-info',
  templateUrl: './seat-info.component.html',
  styleUrls: ['./seat-info.component.scss'],
})
export class SeatInfoComponent implements OnInit, OnDestroy {
  @Input() ruleData?: { title: string; items: string[]; id?: string };


  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    rules: this.fb.array([], Validators.required),
  });

  private subscription!: Subscription;
  eventProfile: Events = {} as Events;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private eventsService: EventsService
  ) {
    this.subscription = this.eventsService.obtenerEventSelect().subscribe({
      next: (event) => { this.eventProfile = structuredClone(event); }
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ngOnInit() {
    if (this.ruleData) {
      this.form.patchValue({ title: this.ruleData.title });
      this.ruleData.items.forEach(rule => this.addRule(rule));
    } else {
      this.addRule();
    }
  }

  get rulesArray(): FormArray {
    return this.form.get('rules') as FormArray;
  }

  addRule(value: string = '') {
    this.rulesArray.push(this.fb.control(value, Validators.required));
  }

  removeRule(index: number) {
    if (this.rulesArray.length > 1) this.rulesArray.removeAt(index);
  }

  onSave() {
    if (this.form.valid) {
      const dataToSend = {
        title: this.form.value.title,
        items: this.form.value.rules,
        event: { id: this.eventProfile.id },
        id: this.ruleData?.id || '',
      };
      this.modalController.dismiss(dataToSend);
    }
  }



  onDelete() {
    if (this.ruleData?.id) {
      this.modalController.dismiss({ deleteId: this.ruleData.id });
    }
  }

  onCancel() {
    this.modalController.dismiss();
  }
}
