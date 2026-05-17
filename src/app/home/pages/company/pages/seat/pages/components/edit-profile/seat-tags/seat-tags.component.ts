import { CommonModule }                      from '@angular/common';
import { Component, Input, OnInit }          from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonicModule, ModalController }      from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Subscription }                      from 'rxjs';
import { KeyboardService }                   from 'src/app/shared/services/keyboard.service';


@Component({
  selector: 'app-seat-tags',
  templateUrl: './seat-tags.component.html',
  styleUrls: ['./seat-tags.component.scss'],
  standalone: true,
  imports: [TranslateModule, IonicModule, ReactiveFormsModule, CommonModule],
})
export class SeatTagsComponent implements OnInit {
  @Input() selectedTags: any = [];
  @Input() suggestedTags: any = [];

  displayMessage: any = {};
  filteredSuggestedTags: any = [];
  form: FormGroup = {} as FormGroup;
  maxTags: number = 10;
  showSearch = false;
  validationMessages: any;

  isKeyboardOpen = false;
  private keyboardSub!: Subscription;
  constructor(
    private translate: TranslateService,
    private modalController: ModalController,
    private formBuild: FormBuilder,
    private keyboardService: KeyboardService
  ) {
    this.keyboardSub = this.keyboardService.isKeyboardOpen$.subscribe(
      (isOpen) => {
        this.isKeyboardOpen = isOpen;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.keyboardSub) this.keyboardSub.unsubscribe();
  }

  ngOnInit() {
    if (!this.selectedTags?.length) this.selectedTags = [];

    this.filteredSuggestedTags = this.suggestedTags.filter((st: any) => {
      const tag = this.selectedTags.find(
        (t: any) => t.trim().toLowerCase() === st.trim().toLowerCase()
      );
      if (tag) return { ...st, checked: true };
    });

    this.filteredSuggestedTags.sort();

    this.initForm();
  }

  onSave() {
    if (!this.selectedTags?.length) {
      return;
    }

    this.modalController.dismiss({
      tags: this.selectedTags,
    });
  }

  onKeyUp(event: KeyboardEvent) {
    event.preventDefault();
    const searchString = this.form.get('search')?.value;
    if (event.key === 'Enter' && !this.filteredSuggestedTags.length)
      this.addTag(searchString);
    else this.filterSuggestedTags(searchString);
  }

  onPreventSubmit(event: any) {
    event.preventDefault();
  }

  addTag(searchString: string) {
    this.selectedTags.push(searchString);
    this.suggestedTags.push(searchString);
    this.filteredSuggestedTags.push(searchString);

    this.filteredSuggestedTags.sort();
  }

  filterSuggestedTags(searchString: string) {
    const filteredData = this.suggestedTags.filter((item: any) =>
      item.toLowerCase().includes(searchString.toLowerCase())
    );

    this.filteredSuggestedTags = filteredData;
  }

  onSelectedTag(tag: any) {}

  updateChecked(event: any, tag: any) {
    if (this.selectedTags?.length >= this.maxTags) {
      this.deleteSelectedSelectedTags(tag);
      event.target.checked = false;
    } else if (event.detail.checked) this.selectedTags.push(tag);
    else this.deleteSelectedSelectedTags(tag);
  }

  deleteSelectedSelectedTags(tag: any) {
    this.selectedTags = this.selectedTags.filter((t: any) => t !== tag);
    this.filteredSuggestedTags = [...this.filteredSuggestedTags];
  }

  findSuggestedTags(tagSelected: any) {
    for (const selectedTag of this.selectedTags) {
      for (const tag of this.filteredSuggestedTags) {
        if (
          tag.trim().toLowerCase() === tagSelected.trim().toLowerCase() &&
          selectedTag.trim().toLowerCase() === tagSelected.trim().toLowerCase()
        ) {
          return true;
        }
      }
    }
    return false;
  }

  onCancel() {
    this.modalController.dismiss();
  }

  private initForm() {
    this.validationMessages = {
      search: {
        required: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
      },
    };

    this.form = this.formBuild.group({
      search: ['', [Validators.required]],
    });
  }
}
