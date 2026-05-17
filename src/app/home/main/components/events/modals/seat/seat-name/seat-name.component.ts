import { Component, OnDestroy }                from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalController }                     from '@ionic/angular';
import { Subscription }                        from 'rxjs';
import { Events }                              from 'src/app/shared/interfaces/events/events';
import { EventsService }                       from 'src/app/shared/services';
import { KeyboardService }                     from 'src/app/shared/services/keyboard.service';
import { required }                            from 'src/app/shared/validators/events.validator';

@Component({
  selector: 'app-seat-name',
  templateUrl: './seat-name.component.html',
  styleUrls: ['./seat-name.component.scss'],
})
export class SeatNameComponent implements OnDestroy {

  form: FormGroup = this.fb.group({
    name: new FormControl('', [ required()] ),
  });

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
    this.keyboardSub = this.keyboardService.isKeyboardOpen$.subscribe(isOpen => {
      this.isKeyboardOpen = isOpen;
    });
    this.form.controls['name'].setValue(this.eventProfile.name);
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.keyboardSub) this.keyboardSub.unsubscribe();
  }

  onSave() {
    this.eventsService.actualizarEvento({ name: this.form.controls['name'].value  });
    this.modalController.dismiss();
  }

  seatName() {
    this.eventsService.seatName(this.eventProfile.id!,this.form.controls['name'].value).subscribe({next:() => this.onSave()})
  }

  onCancel() {
    this.modalController.dismiss();
  }


}
