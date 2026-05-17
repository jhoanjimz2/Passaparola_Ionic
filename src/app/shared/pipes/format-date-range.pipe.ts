import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe }            from '@angular/common';

@Pipe({
  name: 'formatDateRange',
  pure: false
})
export class FormatDateRangePipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(scheduleEvents: { date: string; hourStart: string; hourEnd: string }[]): string {
    if (!scheduleEvents || scheduleEvents.length === 0) {
      return 'Nessuna data';
    }

    // Convertire le date e gli orari in oggetti Date
    const dateTimes = scheduleEvents
      .map(event => ({
        start: this.parseDateTime(event.date, event.hourStart),
        end: this.parseDateTime(event.date, event.hourEnd)
      }))
      .sort((a, b) => a.start.getTime() - b.start.getTime());

    const firstStart = dateTimes[0].start;
    const lastEnd = dateTimes[dateTimes.length - 1].end;

    // Se le date sono lo stesso giorno
    if (
      firstStart.getFullYear() === lastEnd.getFullYear() &&
      firstStart.getMonth() === lastEnd.getMonth() &&
      firstStart.getDate() === lastEnd.getDate()
    ) {
      return `${this.formatDate(firstStart)}, dalle ${this.formatTime(firstStart)} alle ${this.formatTime(lastEnd)}`;
    }

    // Se sono date diverse
    return `Dal ${this.formatDate(firstStart)}, ${this.formatTime(firstStart)} al ${this.formatDate(lastEnd)}, ${this.formatTime(lastEnd)}`;
  }

  private parseDateTime(dateString: string, timeString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    const [hours, minutes] = timeString.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }

  private formatDate(date: Date): string {
    return this.datePipe.transform(date, "d 'di' MMMM 'del' y", 'it-IT') || '';
  }

  private formatTime(date: Date): string {
    return this.datePipe.transform(date, 'HH:mm', 'it-IT') || '';
  }
}
