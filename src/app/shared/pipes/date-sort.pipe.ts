import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateSort',
  pure: false  // Impuro para que se reevalúe al modificar el array
})
export class DateSortPipe implements PipeTransform {
  transform(value: any[]): any[] {
    if (!value) return [];
    // Se crea una copia del array para evitar mutar el original
    return value.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}
