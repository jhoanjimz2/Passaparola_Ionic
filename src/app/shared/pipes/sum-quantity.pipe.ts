import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumQuantity'
})
export class SumQuantityPipe implements PipeTransform {
  transform(items: any[]): number {
    if (!items || items.length === 0) {
      return 0;
    }

    return items.reduce((total, item) => total + (item.quantityAvailable || 0), 0);
  }
}
