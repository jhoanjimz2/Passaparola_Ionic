import { Component, Input, OnDestroy }            from '@angular/core';
import { FormBuilder, FormControl, FormGroup }    from '@angular/forms';
import { ModalController }                        from '@ionic/angular';
import { Subscription }                           from 'rxjs';
import { Events }                                 from 'src/app/shared/interfaces/events/events';
import { EventsService }                          from 'src/app/shared/services';
import { KeyboardService }                        from 'src/app/shared/services/keyboard.service';
import { requiredWithMaxLength }                  from 'src/app/shared/validators/events.validator';

@Component({
  selector: 'app-seat-description',
  templateUrl: './seat-description.component.html',
  styleUrls: ['./seat-description.component.scss'],
})
export class SeatDescriptionComponent  implements OnDestroy {

  form: FormGroup = this.fb.group({
    description: new FormControl('', [ requiredWithMaxLength()] ),
  });

  get _description():any {
    return this.form.get('description');
  }
  get _length(): any {
    return this.form.controls['description'].value?.length ?? 0
  }

  private subscription!: Subscription;
  eventProfile: Events = {} as Events;

  isKeyboardOpen = false;
  private keyboardSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private eventsService: EventsService,
    private keyboardService: KeyboardService
  ) {
    this.subscription = this.eventsService.obtenerEventSelect().subscribe({
      next: (event) => { this.eventProfile = structuredClone(event); }
    });
    this.form.controls['description'].setValue(this.eventProfile.description);
    this.keyboardSub = this.keyboardService.isKeyboardOpen$.subscribe(isOpen => {
      this.isKeyboardOpen = isOpen;
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.keyboardSub) this.keyboardSub.unsubscribe();
  }

  onSave() {
    this.eventsService.actualizarEvento({ description: this.form.controls['description'].value  });
    this.modalController.dismiss();
  }

  seatDescription() {
    this.eventsService.seatDescription(this.eventProfile.id!, this.form.controls['description'].value)
    .subscribe({ next:() => this.onSave() })
  }

  onCancel() {
    this.modalController.dismiss();
  }

}

