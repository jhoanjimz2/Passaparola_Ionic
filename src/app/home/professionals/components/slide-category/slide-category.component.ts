import { CommonModule }                                             from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { ProfessionalCategory, getCategoryName }                    from 'src/app/shared/interfaces/professionals/professionals';
import { ModalController }                                          from '@ionic/angular';
import { ProfessionalsWantedComponent }                             from '../professionals-wanted/professionals-wanted.component';

@Component({
  selector: 'app-slide-category',
  templateUrl: './slide-category.component.html',
  styleUrls: ['./slide-category.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SlideCategoryComponent {
  @ViewChild('swiperCategoryProfessionals') swiperCategoryProfessionals?: ElementRef;

  categories: ProfessionalCategory[] = [];

  constructor(
    private modalCtrl: ModalController
  ) {
    // TODO: Reemplazar con llamada al servicio
    this.loadCategories();
  }

  ngAfterViewInit() {
    if (this.swiperCategoryProfessionals) {
      const swiperEl = this.swiperCategoryProfessionals.nativeElement;
      Object.assign(swiperEl, {
        slidesPerView: 'auto',
        spaceBetween: 8,
      });
      swiperEl.initialize();
    }
  }

  /**
   * Carga las categorías desde el backend
   * TODO: Reemplazar con llamada real al servicio
   */
  private loadCategories(): void {
    this.categories = [
      {
        id: "84f558e2-2228-4abd-8bcf-a4d175fe2d9a",
        description: "Event",
        parentId: null,
        status: true,
        suggestedPercentage: 0,
        minimumPercentage: 0,
        createdAt: "2025-12-23T18:23:41.000Z",
        updatedAt: "2025-12-23T18:23:41.000Z",
        urlImage: null,
        categoryTranslations: [
          {
            id: "06e2b26b-e157-4a27-ae82-6414edab681e",
            description: "Eventi",
            languageCode: "IT"
          }
        ]
      },
      {
        id: "841f6638-9547-43e2-a57d-caffc56f81ac",
        description: "Restaurant",
        parentId: null,
        status: true,
        suggestedPercentage: 0,
        minimumPercentage: 0,
        createdAt: "2025-12-23T18:24:20.000Z",
        updatedAt: "2025-12-23T18:24:20.000Z",
        urlImage: null,
        categoryTranslations: [
          {
            id: "c0b825df-8e53-4099-a792-1b5f8e804280",
            description: "Ristoranti",
            languageCode: "IT"
          }
        ]
      },
      {
        id: "8792b447-9ac5-4d3e-8471-96d3ac91201c",
        description: "Doctor",
        parentId: null,
        status: true,
        suggestedPercentage: 0,
        minimumPercentage: 0,
        createdAt: "2025-12-23T18:26:00.000Z",
        updatedAt: "2025-12-23T22:51:25.000Z",
        urlImage: "",
        categoryTranslations: [
          {
            id: "a24e8375-637f-4633-8dff-27a393104550",
            description: "Dottori",
            languageCode: "IT"
          }
        ]
      }
    ];

    // TODO: Implementar llamada real al servicio
    // this.categoryService.getCategories().subscribe(categories => {
    //   this.categories = categories.filter(cat => cat.status);
    // });
  }

  getCategoryDisplayName(category: ProfessionalCategory): string {
    return getCategoryName(category, 'IT');
  }


  getCategoryImage(category: ProfessionalCategory): string {
    if (category.urlImage && category.urlImage.trim()) {
      return category.urlImage;
    }
    const name = this.getCategoryDisplayName(category);
    const firstLetter = encodeURIComponent(name.charAt(0));
    const color = this.getCategoryColor(category);
    return `https://placehold.co/80x80/${color}/ffffff?text=${firstLetter}`;
  }

  private getCategoryColor(category: ProfessionalCategory): string {
    const colors = [
      '4A90E2', 'E94B9A', '50C878', 'FF6B35', '9B59B6',
      'F39C12', '34495E', '1ABC9C', 'E74C3C', '95A5A6'
    ];
    const hash = category.id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  }

  async onFilterClick(category: ProfessionalCategory): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ProfessionalsWantedComponent,
      componentProps: {
        category
      }
    });
    await modal.present();
  }
}
