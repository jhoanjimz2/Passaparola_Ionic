import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'image',
})
export class ImagePipe implements PipeTransform {
  transform(img: string): any {
    if (!img) {
      return 'assets/images/no-image.jpg';
    }
    return img;
  }
}
