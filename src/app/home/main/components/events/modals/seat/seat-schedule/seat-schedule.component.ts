import { Component, OnDestroy, ViewChild } from '@angular/core';
import { IonDatetime, ModalController } from '@ionic/angular';
import { SeatDateComponent } from '../seat-date/seat-date.component';
import { DatePipe } from '@angular/common';
import { Events } from 'src/app/shared/interfaces/events/events';
import { EventsService } from 'src/app/shared/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seat-schedule',
  templateUrl: './seat-schedule.component.html',
  styleUrls: ['./seat-schedule.component.scss'],
})
export class SeatScheduleComponent implements OnDestroy {
  dateSelect = this.formatDate(new Date().setDate(new Date().getDate() + 1));
  hourInitSelect = '00:00';
  hourEndSelect = '23:00';

  public pickerColumns = [
    {
      name: 'hours',
      options: [
        { text: '00:00', value: '00:00' },
        { text: '01:00', value: '01:00' },
        { text: '02:00', value: '02:00' },
        { text: '03:00', value: '03:00' },
        { text: '04:00', value: '04:00' },
        { text: '05:00', value: '05:00' },
        { text: '06:00', value: '06:00' },
        { text: '07:00', value: '07:00' },
        { text: '08:00', value: '08:00' },
        { text: '09:00', value: '09:00' },
        { text: '10:00', value: '10:00' },
        { text: '11:00', value: '11:00' },
        { text: '12:00', value: '12:00' },
        { text: '13:00', value: '13:00' },
        { text: '14:00', value: '14:00' },
        { text: '15:00', value: '15:00' },
        { text: '16:00', value: '16:00' },
        { text: '17:00', value: '17:00' },
        { text: '18:00', value: '18:00' },
        { text: '19:00', value: '19:00' },
        { text: '20:00', value: '20:00' },
        { text: '21:00', value: '21:00' },
        { text: '22:00', value: '22:00' },
        { text: '23:00', value: '23:00' },
      ],
    },
  ];

  pickerHourStar = [
    { text: 'Cancel', role: 'cancel' },
    {
      text: 'Confirm',
      handler: (value: any) => {
        this.hourInitSelect = value.hours.value;
      },
    },
  ];
  pickerHourEnd = [
    { text: 'Cancel', role: 'cancel' },
    {
      text: 'Confirm',
      handler: (value: any) => {
        this.hourEndSelect = value.hours.value;
      },
    },
  ];

  private subscription!: Subscription;
  eventProfile: Events = {} as Events;

  constructor(
    private modalController: ModalController,
    private datePipe: DatePipe,
    private eventsService: EventsService
  ) {
    this.subscription = this.eventsService.obtenerEventSelect().subscribe({
      next: (event) => {
        this.eventProfile = structuredClone(event);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onCancel() {
    this.modalController.dismiss();
  }

  onSave() {
    let { dateFrom, dateTo } = this.getDateRange(this.eventProfile.schedule!);
    this.eventsService.actualizarEvento({
      schedule: this.eventProfile.schedule,
      dateFrom: new Date(dateFrom),
      dateTo: new Date(dateTo),
    });
    this.modalController.dismiss();
  }

  seatSchedule() {
    let { dateFrom, dateTo } = this.getDateRange(this.eventProfile.schedule!);
    this.eventsService
      .seatSchedule(
        this.eventProfile.id!,
        this.eventProfile.schedule!,
        new Date(dateFrom),
        new Date(dateTo)
      )
      .subscribe({
        next: () => {
          this.onSave();
        },
        error: () => {},
      });
  }

  formatDate(date: any) {
    return this.datePipe.transform(new Date(date), 'yyyy-MM-dd')!;
  }

  dateExists(): boolean {
    if (this.eventProfile.schedule?.length === 0) return false;
    return (this.eventProfile.schedule ?? []).some(
      (schedule) => schedule.date === this.dateSelect
    );
  }

  async openModalSeatDate() {
    const modal = await this.modalController.create({
      component: SeatDateComponent,
      backdropDismiss: true,
      cssClass: ['radius-modals', 'modal-95vh'],
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      componentProps: {
        selected: this.dateSelect,
        previewSelected: this.eventProfile.schedule,
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data?.date) this.dateSelect = data.date;
  }

  onSaveDate() {
    if (!this.eventProfile.schedule) this.eventProfile.schedule = [];
    this.eventProfile.schedule.push({
      id: this.generateId,
      date: this.formatDate(this.dateSelect + 'T00:00:00'),
      hourStart: this.hourInitSelect,
      hourEnd: this.hourEndSelect,
    });
    this.dateSelect = this.formatDate(
      new Date().setDate(new Date().getDate() + 1)
    );
    this.hourInitSelect = '00:00';
    this.hourEndSelect = '23:00';
  }

  get generateId(): number {
    return this.eventProfile.schedule?.length
      ? Math.max(...this.eventProfile.schedule!.map((s) => s.id!)) + 1
      : 1;
  }

  onTrash(id: number) {
    this.eventProfile.schedule = this.eventProfile.schedule?.filter(
      (s) => s.id !== id
    );
  }

  // Función para convertir fecha y hora en un objeto Date
  parseDateTime(dateString: string, timeString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }

  // Función para formatear la fecha en formato ISO 8601 (YYYY-MM-DD HH:mm)
  formatDateISO(date: Date): string {
    return `${date.getFullYear()}-${this.padZero(
      date.getMonth() + 1
    )}-${this.padZero(date.getDate())} ${this.padZero(
      date.getHours()
    )}:${this.padZero(date.getMinutes())}`;
  }

  // Función auxiliar para agregar ceros a números menores de 10 (Ej: 9 → 09)
  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  getDateRange(
    scheduleEvents: { date: string; hourStart: string; hourEnd: string }[]
  ): { dateFrom: string; dateTo: string } {
    if (!scheduleEvents || scheduleEvents.length === 0) {
      return { dateFrom: '', dateTo: '' };
    }

    // Convertimos las fechas a objetos Date y ordenamos por la hora de inicio
    const dateTimes = scheduleEvents
      .map((event) => ({
        start: this.parseDateTimeUTC(event.date, event.hourStart),
        end: this.parseDateTimeUTC(event.date, event.hourEnd),
      }))
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    const firstStart = dateTimes[0].start;
    const lastEnd = dateTimes[dateTimes.length - 1].end;

    return {
      dateFrom: firstStart.toISOString(),
      dateTo: lastEnd.toISOString(),
    };
  }

  // Función para convertir fecha y hora en un objeto Date en UTC
  parseDateTimeUTC(dateString: string, timeString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date(Date.UTC(year, month - 1, day, hours, minutes));
  }
}
