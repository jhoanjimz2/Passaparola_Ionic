import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minPrice'
})
export class MinPricePipe implements PipeTransform {
  transform(items: any[]): number {
    if (!items || items.length === 0) {
      return 0;
    }

    // Encontrar el mínimo precio en el array
    return Math.min(...items.map(item => item.price));
  }
}
