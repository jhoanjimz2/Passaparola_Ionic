import { CommonModule }                   from '@angular/common';
import { Component, Input, OnInit }       from '@angular/core';
import { IonContent, IonIcon }            from '@ionic/angular/standalone';
import { SocialTag }                      from 'src/app/shared/interfaces/social/social-post';
import { StoreTagComponent }              from '../../tags/store-tag/store-tag.component';
import { ModalController, NavController } from '@ionic/angular';
import { UserTagComponent }               from '../../tags/user-tag/user-tag.component';
import { InvestmentTagComponent }         from "../../tags/investment-tag/investment-tag.component";
import { EventTagComponent }              from "../../tags/event-tag/event-tag.component";
import { ProductTagComponent }            from '../../tags/product-tag/product-tag.component';

@Component({
  selector: 'app-view-post-tags',
  templateUrl: './view-post-tags.component.html',
  styleUrls: ['./view-post-tags.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    CommonModule,
    StoreTagComponent,
    UserTagComponent,
    InvestmentTagComponent,
    EventTagComponent,
    ProductTagComponent
]
})
export class ViewPostTagsComponent implements OnInit {
  @Input() post: SocialTag = {} as SocialTag;

  tabTags: string = 'product';

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.selectFirstAvailableTab();
  }

  setTabTags(tab: string) {
    this.tabTags = tab;
  }

  private selectFirstAvailableTab(): void {
    const tabOrder = ['product', 'verified', 'store', 'user', 'event', 'investment'];
    for (const tabType of tabOrder) {
      if (this.hasContent(tabType)) {
        this.tabTags = tabType;
        return;
      }
    }
    this.tabTags = 'product';
  }

  private hasContent(tabType: string): boolean {
    if (!this.post) return false;

    switch (tabType) {
      case 'product':
        return !!(this.post.products && this.post.products.length > 0);
      case 'verified':
        return !!(this.post.verifiedProducts && this.post.verifiedProducts.length > 0);
      case 'store':
        return !!this.post.store;
      case 'user':
        // return !!(this.post.users && this.post.users.length > 0);
      case 'event':
        return !!this.post.event;
      case 'investment':
        return !!this.post.project;
      default:
        return false;
    }
  }

  getItemCount(tabType: string): number {
    if (!this.post) return 0;

    switch (tabType) {
      case 'product':
        return this.post.products?.length || 0;
      case 'verified':
        return this.post.verifiedProducts?.length || 0;
      case 'store':
        return this.post.store ? 1 : 0;
      case 'user':
        // return this.post.users?.length || 0;
      case 'event':
        // return this.post.events?.length || 0;
      case 'investment':
        // return this.post.investments?.length || 0;
      default:
        return 0;
    }
  }

  goStore() {
    this.modalCtrl.dismiss()
    this.navCtrl.navigateForward(['/pages/company/seat/modify', this.post.store!.id], {
      queryParams: { detail: true },
    });
  }
  goUser(id: string) {
    this.modalCtrl.dismiss()
    this.navCtrl.navigateForward(['/pages/company/seat/modify-simple', id], {
      queryParams: { detail: true },
    });
  }
}
