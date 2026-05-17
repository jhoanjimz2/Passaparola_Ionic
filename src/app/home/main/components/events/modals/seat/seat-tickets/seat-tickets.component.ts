import { Component, Input, OnDestroy, OnInit }                                 from '@angular/core';
import { FormBuilder, FormControl, FormGroup }                                 from '@angular/forms';
import { ModalController }                                                     from '@ionic/angular';
import { Subscription }                                                        from 'rxjs';
import { Events, Ticket }                                                      from 'src/app/shared/interfaces/events/events';
import { EventsService }                                                       from 'src/app/shared/services';
import { KeyboardService }                                                     from 'src/app/shared/services/keyboard.service';
import { min10, required, requiredAndNumeric, requiredAndNumericMin10 }        from 'src/app/shared/validators/events.validator';

@Component({
  selector: 'app-seat-tickets',
  templateUrl: './seat-tickets.component.html',
  styleUrls: ['./seat-tickets.component.scss'],
})
export class SeatTicketsComponent implements OnDestroy, OnInit {

  @Input() ticket!: Ticket;

  eventProfile: Events = {} as Events;

  form: FormGroup = this.fb.group({
    name:         new FormControl('', [required()] ),
    pr:           new FormControl('', [requiredAndNumericMin10()] ),
    description:  new FormControl('', [required()] ),
    isPreSale:    new FormControl(false, [] ),
    isFree:       new FormControl(false, [] ),
    price:        new FormControl('', [requiredAndNumeric()] ),
    quantity:     new FormControl('', [requiredAndNumeric()] ),
  });

  get isPreSale() { return this.form.controls['isPreSale'].value }

  get name():any { return this.form.get('name') }

  private subscription!: Subscription;

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
  }
  ngOnInit(): void {
    if (this.ticket) {
      this.form.controls["name"]        .setValue(this.ticket.name);
      this.form.controls["description"] .setValue(this.ticket.description);
      this.form.controls["pr"]          .setValue(this.ticket.pr);
      this.form.controls["price"]       .setValue(this.ticket.price);
      this.form.controls["quantity"]    .setValue(this.ticket.quantity);
      this.form.controls["isFree"]      .setValue(this.ticket.isFree);
      this.form.controls["isPreSale"]   .setValue(this.ticket.isPreSale);
      if (this.ticket.isFree) {
        this.form.controls['price'].disable();
        this.form.controls['price'].clearValidators();
        this.form.controls['price'].setValue(0);
        this.form.controls['pr'].disable();
        this.form.controls['pr'].clearValidators();
        this.form.controls['pr'].setValue(0);
        this.form.controls['price'].updateValueAndValidity();
        this.form.controls['pr'].updateValueAndValidity();
      }
      this.form.markAsTouched();
    }
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.keyboardSub) this.keyboardSub.unsubscribe();
  }

  onCancel() {
    this.modalController.dismiss();
  }
  changeIsFree(event: any) {
    if (event.detail.checked) {
      this.form.controls['price'].disable();
      this.form.controls['price'].clearValidators();
      this.form.controls['price'].setValue(0);
    } else {
      this.form.controls['price'].enable();
      this.form.controls['price'].setValidators([requiredAndNumeric()]);
      this.form.controls['price'].setValue('');
    }
    this.form.controls['price'].updateValueAndValidity();
  }
  eliminar() {
    this.eventsService.deletTicketEventToId(this.ticket.id!)
    .subscribe({ next:() => {
      this.eventsService.getTicketsToIdEventToProfile(this.eventProfile.id!).subscribe({
        next: () => this.modalController.dismiss()
      });
    }})
  }
  newTicket() {
    if (this.ticket) {this.updateTicket()}
    if (!this.ticket) {this.createTicket()}
  }
  updateTicket() {
    this.eventsService.createTicketEvent({
      name:              this.form.controls['name'].value,
      pr:                +this.form.controls['pr'].value,
      description:       this.form.controls['description'].value,
      price:             this.form.controls['price'].value,
      isFree:            this.form.controls['isFree'].value,
      isPreSale:         this.form.controls['isPreSale'].value,
      quantity:          +this.form.controls['quantity'].value,
      id:                this.ticket.id,
      event:            { id: this.eventProfile.id! }
    })
    .subscribe({ next:() => {
      this.eventsService.getTicketsToIdEventToProfile(this.eventProfile.id!).subscribe({
        next: () => this.modalController.dismiss()
      });
    }})
  }
  createTicket() {
    this.eventsService.createTicketEvent({
      name:              this.form.controls['name'].value,
      pr:                +this.form.controls['pr'].value,
      description:       this.form.controls['description'].value,
      price:             this.form.controls['price'].value,
      isFree:            this.form.controls['isFree'].value,
      isPreSale:         this.form.controls['isPreSale'].value,
      quantity:          +this.form.controls['quantity'].value,
      event:            { id: this.eventProfile.id! }
    })
    .subscribe({ next:() => {
      this.eventsService.getTicketsToIdEventToProfile(this.eventProfile.id!).subscribe({
        next: () => this.modalController.dismiss()
      });
    }})
  }


}
