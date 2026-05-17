import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskNumberAccount',
})
export class MaskNumberAccountPipe implements PipeTransform {
  transform(
    value: string | number,
    numChars: number = 5,
    char: string = '*'
  ): string {
    let string = value.toString();

    let lastFour = string.slice(-4);

    let ocultarStr = char.repeat(numChars);

    return ocultarStr + lastFour;
  }
}
