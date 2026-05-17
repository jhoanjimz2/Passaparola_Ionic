import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  IBusinessSuggestion,
  TStatus,
  EStatus,
  IResponseBusinessSuggestion,
} from 'src/app/shared/interfaces/business-suggestion/business-suggestion.interface';
import { BusinessSuggestionService } from 'src/app/shared/services/business-suggestion.service';

@Component({
  selector: 'app-bs-tabs',
  templateUrl: './bs-tabs.component.html',
  styleUrls: ['./bs-tabs.component.scss'],
})
export class BsTabsComponent implements OnInit {
  businessSuggestions: IBusinessSuggestion[] = [];
  eStatus = EStatus;
  infiniteScrollEnabled = false;
  limit = 20;
  page = 1;
  status: TStatus = EStatus.all;
  tabActive: 'list' | 'vote' = 'list';

  constructor(
    private businessSuggestionService: BusinessSuggestionService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.findAll();
  }

  findAll(event?: any) {
    if (event?.status) {
      this.status = event.status;
      this.infiniteScrollEnabled = false;
      this.page = 1;
      this.businessSuggestions = [];
    }

    this.businessSuggestionService
      .findAll({
        status: this.status,
        filterUser: true,
        offset: this.page,
        limit: this.limit,
      })
      .subscribe(({ data, metadata }: IResponseBusinessSuggestion) => {
        this.businessSuggestions.push(...data);
        this.page++;

        if (metadata.page < metadata.lastPage)
          this.infiniteScrollEnabled = true;
        else this.infiniteScrollEnabled = false;

        if (event?.target) {
          event?.target?.complete();
        }
      });
  }

  onGoToNewBS() {
    this.modalController.dismiss({
      goToNewBS: true,
    });
  }
}
