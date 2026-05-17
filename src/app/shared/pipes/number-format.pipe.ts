import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat',
  standalone: true
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '0';
    }

    // Si es menor a 1000 (3 dígitos), mostrar el número completo
    if (value < 1000) {
      return value.toString();
    }

    // Si es menor a 1 millón, formatear con 'k'
    if (value < 1000000) {
      const formatted = value / 1000;
      // Si es un número entero, no mostrar decimales
      if (formatted % 1 === 0) {
        return `${formatted}k`;
      }
      // Mostrar 1 decimal si no es entero
      return `${formatted.toFixed(1)}k`;
    }

    // Si es 1 millón o más, formatear con 'M'
    const formatted = value / 1000000;
    if (formatted % 1 === 0) {
      return `${formatted}M`;
    }
    return `${formatted.toFixed(1)}M`;
  }
}
