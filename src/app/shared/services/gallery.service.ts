import { HttpClient }   from '@angular/common/http';
import { Injectable }   from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  // private API_URL = 'https://api.unsplash.com/search/photos';
  // private CLIENT_ID = 'jRPQIU7m7CptN-m-14IZy_gpq3IdKFYrCGYQYw7oiCg';

  private API_KEY = '49450745-6b13851e1c0a8adbaa3d8fc39'; // Reemplaza con tu clave de Pixabay
  private API_URL = 'https://pixabay.com/api/';

  constructor(private http: HttpClient) {}

  searchImages(query: string) {
    return this.http.get(`${this.API_URL}?key=${this.API_KEY}&q=${query}&image_type=photo&per_page=50`);
  }


  async selectImage(imageUrl: string, path: string) {
    try {
      const blob = await this.urlToBlob(imageUrl);
      const dataUrl = await this.blobToDataURL(blob);
      const type = await this.getImageTypeFromUrl(imageUrl);
      const filePath = `passaparola/${path}/${uuidv4()}.${type}`;
      return { blob, dataUrl, type, filePath }
    } catch (error) {
      return null
    }
  }

  async urlToBlob(url: string): Promise<Blob> {
    const response = await fetch(url);
    return await response.blob();
  }

  async blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async getImageTypeFromUrl(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const type = blob.type.split('/')[1];
      return type;
    } catch (error) {
      return 'jpg';
    }
  }


}
