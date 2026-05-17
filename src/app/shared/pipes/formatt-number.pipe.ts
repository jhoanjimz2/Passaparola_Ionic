import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency } from '@angular/common';

@Pipe({
  name: 'formattNumber',
  standalone: true,
})
export class FormattNumberPipe implements PipeTransform {
  transform(
    value: number,
    currencyCode: string = 'EUR',
    display: 'code' | 'symbol' | 'symbol-narrow' | string | boolean = 'symbol',
    locale: string = 'it',
    fixedDecimals?: number // 👈 parámetro opcional
  ): string | null {
    if (value == null) return null;

    let decimalPlaces = 2;

    if (fixedDecimals != null && fixedDecimals >= 0) {
      // 👈 Si se pasa una cantidad fija de decimales
      decimalPlaces = fixedDecimals;
    } else {
      // 👈 Lógica por defecto si no se pasa el parámetro
      const valueToString = value.toString();

      if (valueToString.includes('.')) {
        const decimalPart = valueToString.split('.')[1];
        const decimalLength = decimalPart.length;

        if (decimalLength === 3) decimalPlaces = 3;
        else if (decimalLength >= 4) decimalPlaces = 4;
      }
    }

    const digitsInfo = `1.${decimalPlaces}-${decimalPlaces}`;
    return formatCurrency(value, locale, '', currencyCode, digitsInfo);
  }
}
