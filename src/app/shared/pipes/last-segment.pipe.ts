import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lastSegment',
})
export class LastSegmentPipe implements PipeTransform {
  transform(value: string, separator: string = '-'): string {
    if (!value) {
      return '';
    }
    const segments = value.split(separator);
    return segments[segments.length - 1];
  }
}
