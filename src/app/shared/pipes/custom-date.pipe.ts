import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true
})
export class CustomDatePipe implements PipeTransform {

  private monthsAbbr = [
    'Genn', 'Febbr', 'Mar', 'Apr', 'Magg', 'Giugno',
    'Luglio', 'Ag', 'Sett', 'Ott', 'Nov', 'Dic'
  ];

  transform(value: any): string {
    if (!value) return '';

    const date = new Date(value);
    const day = date.getDate();
    const month = this.monthsAbbr[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }
}
