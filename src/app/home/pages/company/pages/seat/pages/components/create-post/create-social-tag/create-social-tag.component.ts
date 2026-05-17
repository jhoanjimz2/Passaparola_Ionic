import { Component, Input, OnDestroy }                                          from '@angular/core';
import { ModalController }                                                      from '@ionic/angular';
import { SelectFriendTagComponent }                                             from '../select-friend-tag/select-friend-tag.component';
import { SelectProductTagComponent }                                            from '../select-product-tag/select-product-tag.component';
import { SelectStoreTagComponent }                                              from '../select-store-tag/select-store-tag.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SocialService }                                                        from 'src/app/shared/services/social.service';
import { EventsService, UploadService }                                         from 'src/app/shared/services';
import { SocialTag }                                                            from 'src/app/shared/interfaces/social/social-post';
import { SessionService }                                                       from 'src/app/shared/services/session.service';
import { CommonModule }                                                         from '@angular/common';
import { IonIcon, IonContent }                                                  from '@ionic/angular/standalone';
import { UploadMediaComponent }                                                 from '../upload-media/upload-media.component';
import { ComponentModule }                                                      from 'src/app/components/component.module';
import { SelectEventTagComponent }                                              from '../select-event-tag/select-event-tag.component';
import { SelectInvestmentTagComponent }                                         from '../select-investment-tag/select-investment-tag.component';
import { ProjectsService }                                                      from 'src/app/shared/services/projects.service';
import { Project }                                                              from 'src/app/shared/interfaces/projects/project';
import { InvestmentTagComponent }                                               from 'src/app/home/pages/company/pages/seat/pages/components/tags/investment-tag/investment-tag.component';
import { Events }                                                               from 'src/app/shared/interfaces/events/events';
import { EventTagComponent }                                                    from 'src/app/home/pages/company/pages/seat/pages/components/tags/event-tag/event-tag.component';
import { StoreTagComponent }                                                    from 'src/app/home/pages/company/pages/seat/pages/components/tags/store-tag/store-tag.component';
import { UserTagComponent }                                                     from 'src/app/home/pages/company/pages/seat/pages/components/tags/user-tag/user-tag.component';
import { UserTagsService }                                                      from 'src/app/shared/services/user-tags.service';
import { User }                                                                 from 'src/app/shared/interfaces/user/user.interface';
import { ProductTagsService }                                                   from 'src/app/shared/services/product-tags.service';
import { ProductTagCreateComponent }                                            from '../../tags/product-tag-create/product-tag-create.component';
import { SeatCategoryTagsComponent }                                            from '../seat-category-tags/seat-category-tags.component';
import { SocialTagsService }                                                    from 'src/app/shared/services/social-tags.service';

@Component({
  selector: 'app-create-social-tag',
  templateUrl: './create-social-tag.component.html',
  styleUrls: ['./create-social-tag.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    IonContent,
    ReactiveFormsModule,
    UploadMediaComponent,
    StoreTagComponent,
    UserTagComponent,
    ComponentModule,
    InvestmentTagComponent,
    EventTagComponent,
    ProductTagCreateComponent
  ]
})
export class CreateSocialTagComponent implements OnDestroy{
  @Input() id: string = ''

  socialTag: SocialTag = {} as SocialTag;
  user: User = {} as User;

  usersSelect: any[] = [];
  tagsSelect: any[] = [];
  storeSelect: any;
  project: Project | null = null;
  event: Events | null = null;
  products: any[] = [];

  file: any;
  preview: any;
  typeFile: any;
  urlFile: any;

  formCreateTag: FormGroup = this.formBuild.group({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  constructor(
    private modalController: ModalController,
    private formBuild: FormBuilder,
    private socialService: SocialService,
    private socialTagsService: SocialTagsService,
    private uploadService: UploadService,
    private sessionService: SessionService,
    private eventsService: EventsService,
    private projectsService: ProjectsService,
    private userTagsService: UserTagsService,
    private productTagsService: ProductTagsService
  ) {
    const user = localStorage.getItem('appPassaparola_user');
    this.user = JSON.parse(user!);
    this.eventsService.getAllEvents({}).subscribe()
    this.eventsService.getAllCategoryFlatten().subscribe()
    this.projectsService.categoriesProyects()
    this.socialTagsService.categoriesTags({limit: 1000000000,offset: 1})
    this.productTagsService.categoriesProducts()
    this.productTagsService.allProducts()
    this.projectsService.allProjects()

    this.userTagsService
      .loadUsersMergedData('IT00000000000001', 0, 0)
      // .loadUsersMergedData(this.user.userID!, 0, 0)
      .subscribe();
  }
  ngOnDestroy(): void {
  }

  async selectInvestment() {
    const modal = await this.modalController.create({
      component: SelectInvestmentTagComponent,
      cssClass: [ 'modal-80vh-2'],
      breakpoints: [0,1],
      initialBreakpoint: 1
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (!data) return;

    this.project = data.project
  }

  async selectEvent() {
    const modal = await this.modalController.create({
      component: SelectEventTagComponent,
      cssClass: [ 'modal-80vh-2'],
      breakpoints: [0,1],
      initialBreakpoint: 1
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (!data) return;

    this.event = data.event
  }

  async selectFriendTag() {
    const modal = await this.modalController.create({
      component: SelectFriendTagComponent,
      cssClass: [ 'modal-80vh-2'],
      componentProps: {
        usersSelect: this.usersSelect.map(user => ({ ...user }))
      },
      breakpoints: [0,1],
      initialBreakpoint: 1
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (!data) return;

    this.usersSelect = data;
  }

  async selectProductTag(typeProduct: 'all' | 'my') {
    const modal = await this.modalController.create({
      component: SelectProductTagComponent,
      componentProps: {
        typeProduct,
        multiSelect: true,
        productsSelectedPrev: this.products
      },
      cssClass: [ 'modal-80vh-2'],
      breakpoints: [0,1],
      initialBreakpoint: 1
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (!data) return;

    if (typeProduct === 'all') {
      this.products = data.products
    }
  }

  async selectStoreTag() {
    const modal = await this.modalController.create({
      component: SelectStoreTagComponent,
      cssClass: [ 'modal-80vh-2'],
      breakpoints: [0,1],
      initialBreakpoint: 1
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.seat) {
      this.storeSelect = data.seat;
    }
  }
  // Para abrir el modal
  async selectTags() {
    const modal = await this.modalController.create({
      component: SeatCategoryTagsComponent,
      componentProps: {
        initialData: this.tagsSelect
      },
      cssClass: ['radius-modals', 'modal-95vh'],
      breakpoints: [0,1],
      initialBreakpoint: 1,
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'save' && data) {
      this.tagsSelect = data;
    }
  }








  removeTag(tag: string) {
    this.tagsSelect = this.tagsSelect.filter(t => t !== tag);
  }
  deselectUser(event: any) {
    this.usersSelect = this.usersSelect.filter(u => u.userID !== event.user.userID);
  }
  deleteProduct(product: any): void {
    this.products = this.products.filter(p => p.id !== product.id);
  }


  async uploadMedia(event: any) {
    this.file = event.file;
    this.preview = event.preview;
    this.typeFile = event.typeFile;

    const date = new Date().getMilliseconds();
    const path = `passaparola/social-tag/${date}.${ this.typeFile === 'image' ? 'png' : 'mp4'}`;
    this.urlFile = await this.uploadService.uploadFile(this.file, path);
  }

  async createSocialTag() {
    this.socialTag.title = this.formCreateTag.controls['title'].value
    this.socialTag.description = this.formCreateTag.controls['description'].value;
    this.socialTag.urlFile = this.urlFile;
    this.socialTag.typeFile = this.typeFile;
    this.socialTag.products = [];
    this.socialTag.status = true
    this.socialTag.categoryTopics = this.tagsSelect;
    this.socialTag.topics = this.tagsSelect.flatMap((item: any) => item.topics);
    this.socialTag.userIds = this.usersSelect?.length ? this.usersSelect.map(u => u.userID) : [];
    this.socialTag.verifiedProducts = [];
    this.socialTag.store = this.storeSelect?.id ? { id: this.storeSelect.id } : null
    this.socialTag.project = this.project?.id ? { id: this.project.id } : null
    this.socialTag.event = this.event?.id ? { id: this.event.id } : null

    if (!this.sessionService.isUser) {
      this.socialTag.seat = { id: this.id }
    }
    this.socialService.create(this.socialTag).subscribe({
      next: (response) => {
        this.modalController.dismiss({newpost: true});
      }
    })
  }

}
