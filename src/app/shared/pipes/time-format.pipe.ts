import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const [hourStr, minute] = value.split(':');
    let hour = parseInt(hourStr, 10);
    let period = 'am';
    if (hour >= 12) {
      period = 'pm';
      if (hour > 12) {
        hour -= 12;
      }
    } else if (hour === 0) {
      hour = 12;
    }
    return `${hour}:${minute} ${period}`;
  }
}
