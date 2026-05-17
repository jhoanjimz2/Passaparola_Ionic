import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imageEvent',
  pure: false, // Permite que Angular vuelva a evaluar el pipe cuando sea necesario
})
export class ImageEventPipe implements PipeTransform {
  private fallback: string = 'assets/images/events/custom-icons/noimage.svg';
  private cache: { [key: string]: string } = {}; // Cache para mejorar rendimiento

  transform(imageUrl: string | null | undefined): string {
    if (!imageUrl || typeof imageUrl !== 'string') {
      return this.fallback;
    }

    // Si ya hemos validado esta imagen antes, devolvemos el resultado almacenado
    if (this.cache[imageUrl]) {
      return this.cache[imageUrl];
    }

    // Retornamos temporalmente la imagen original mientras validamos
    this.cache[imageUrl] = imageUrl;

    this.imageExists(imageUrl).then((validUrl) => {
      this.cache[imageUrl] = validUrl;
    });

    return imageUrl;
  }

  private imageExists(url: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;

      img.onload = () => resolve(url); // Si la imagen carga bien, la usamos
      img.onerror = () => resolve(this.fallback); // Si falla, usamos el fallback
    });
  }
}
