import { Component, OnDestroy }                from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalController }                     from '@ionic/angular';
import { Subscription }                        from 'rxjs';
import { Events }                              from 'src/app/shared/interfaces/events/events';
import { EventsService }                       from 'src/app/shared/services';
import { KeyboardService }                     from 'src/app/shared/services/keyboard.service';
import { maxLength }                           from 'src/app/shared/validators/events.validator';

@Component({
  selector: 'app-seat-green',
  templateUrl: './seat-green.component.html',
  styleUrls: ['./seat-green.component.scss'],
})
export class SeatGreenComponent  implements OnDestroy {

  form: FormGroup = this.fb.group({
    greenDescription: new FormControl('', [ maxLength()] ),
  });

  get _greenDescription():any {
    return this.form.get('greenDescription');
  }
  get _length(): any {
    return this.form.controls['greenDescription'].value?.length ?? 0
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
    this.form.controls['greenDescription'].setValue(this.eventProfile.greenDescription);
    this.keyboardSub = this.keyboardService.isKeyboardOpen$.subscribe(isOpen => {
      this.isKeyboardOpen = isOpen;
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.keyboardSub) this.keyboardSub.unsubscribe();
  }

  onCancel() {
    this.modalController.dismiss();
  }

  onSave() {
    this.eventsService.actualizarEvento({
      greenDescription: this.form.controls['greenDescription'].value,
      isGreen: this.form.controls['greenDescription'].value ? true : false
    });
    this.modalController.dismiss();
  }

  seatGreen() {
    this.eventsService.seatGreen(
      this.eventProfile.id!,
      this.form.controls['greenDescription'].value,
      this.form.controls['greenDescription'].value ? true : false,
    )
    .subscribe({ next:() => this.onSave() })
  }

}
