import { Component, Input } from '@angular/core';
import { ModalController }  from '@ionic/angular';
import { GalleryService }   from 'src/app/shared/services/gallery.service';

@Component({
  selector: 'app-modal-gallery',
  templateUrl: './modal-gallery.component.html',
  styleUrls: ['./modal-gallery.component.scss'],
})
export class ModalGalleryComponent {
  @Input() pathImg: string = '';
  query: string = '';
  images: any[] = [];

  constructor(
    private galleryService: GalleryService,
    private modalController: ModalController
  ) {}

  close() {
    this.modalController.dismiss()
  }

  onSearchChange() {
    this.galleryService.searchImages(this.query).subscribe((res: any) => {
      this.images = res.hits;
    });
  }

  async selectImage(imageUrl: string) {
    const result = await this.galleryService.selectImage(imageUrl, this.pathImg);
    if (result) {
      const { blob, dataUrl, type, filePath } = result;
      this.modalController.dismiss({ blob, dataUrl, type, filePath })
    }
  }




}
