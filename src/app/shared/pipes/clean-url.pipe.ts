import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cleanUrl',
  standalone: true
})
export class CleanUrlPipe implements PipeTransform {
  transform(url: string): string {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace(/^www\./, '');
    } catch (e) {
      return url
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .split('/')[0];
    }
  }
}
