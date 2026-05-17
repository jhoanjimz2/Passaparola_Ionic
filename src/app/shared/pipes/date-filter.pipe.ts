import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFilter',
  pure: false
})
export class DateFilterPipe implements PipeTransform {
  transform(schedules: { id?: number, date: string, hourStart: string, hourEnd: string }[] | null): { id?: number, date: string, hourStart: string, hourEnd: string }[] {
    if (!schedules || schedules.length === 0) return [];

    return schedules
      .filter(schedule => this.isValidDate(schedule.date))
      .sort((a, b) => this.parseDate(a.date) - this.parseDate(b.date));
  }

  private parseDate(dateStr: string): number {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return 0;
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])).getTime();
  }

  private isValidDate(dateStr: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  }
}
