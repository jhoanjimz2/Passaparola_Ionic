import { DatePipe }                                         from '@angular/common';
import { Component, Input, ViewChild }                      from '@angular/core';
import { FormBuilder }                                      from '@angular/forms';
import { IonDatetime, ModalController }                     from '@ionic/angular';
import { ScheduleEvent }                                    from 'src/app/shared/interfaces/events/events';

@Component({
  selector: 'app-seat-date',
  templateUrl: './seat-date.component.html',
  styleUrls: ['./seat-date.component.scss'],
})
export class SeatDateComponent {
  @Input() selected:any;
  @Input() previewSelected: ScheduleEvent[] = [];
  @ViewChild('datePicker', { static: false }) datePicker!: IonDatetime;

  minDate = this.formatDate(new Date().setDate(new Date().getDate() + 1));


  highlightedDates = this.previewSelected.map(item => ({
    date: item.date,
    textColor: 'white',
    backgroundColor: 'black'
  }));
  disableDates = (dateString: string): boolean => {
    return !this.previewSelected.some(item => item.date === dateString);
  };

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private datePipe: DatePipe
  ) {
  }

  ngAfterViewInit() {
    this.datePicker.value = this.selected;
  }

  formatDate(date:any) {
    return this.datePipe.transform(date, 'yyyy-MM-dd')!;
  }
  onCancel() {
    this.modalController.dismiss();
  }
  onSave() {
    this.modalController.dismiss({ date: this.datePicker.value })
  }



}
