import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators }                      from '@angular/forms';

import { ModalController }                                                          from '@ionic/angular';

import { TranslateService }                                                         from '@ngx-translate/core';
import { Observable,                                                                fromEvent, merge, debounceTime, Subscription } from 'rxjs';
import { CategoryEvent, Events }                                                    from 'src/app/shared/interfaces/events/events';
import { EventsService }                                                            from 'src/app/shared/services';
import { KeyboardService }                                                          from 'src/app/shared/services/keyboard.service';

import { GenericValidator }                                                         from 'src/app/shared/validators/generic-validator';

@Component({
  selector: 'app-seat-category',
  templateUrl: './seat-category.component.html',
  styleUrls: ['./seat-category.component.scss'],
})
export class SeatCategoryComponent implements OnInit, OnDestroy {
  @ViewChild('search') search!: ElementRef;
  @ViewChildren(FormControlName, { read: ElementRef })

  private genericValidator!: GenericValidator;
  private subscription!: Subscription;
  private subscription2!: Subscription;
  eventProfile: Events = {} as Events;
  allCategories: CategoryEvent[] = [];

  formInputElements!: ElementRef[];
  categoriesWithChildrenAux: CategoryEvent[] = [];
  categoriesTree: CategoryEvent[] = [];
  displayMessage: any = {};
  filteredCategories: any = [];
  form: FormGroup = {} as FormGroup;
  showSearch = false;
  validationMessages: any;


  isKeyboardOpen = false;
  private keyboardSub!: Subscription;

  constructor(
    private keyboardService: KeyboardService,
    private translate: TranslateService,
    private modalController: ModalController,
    private formBuild: FormBuilder,
    private eventsService: EventsService
  ) {
    this.genericValidator = new GenericValidator();
    this.subscription = this.eventsService.obtenerEventSelect().subscribe({
      next: (event) => { this.eventProfile = structuredClone(event); }
    });
    this.subscription2 = this.eventsService.obtenerAllCategorys().subscribe({
      next: (event) => { this.allCategories = structuredClone(event); }
    });
    this.keyboardSub = this.keyboardService.isKeyboardOpen$.subscribe(isOpen => {
      this.isKeyboardOpen = isOpen;
    });
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.subscription2) this.subscription2.unsubscribe();
    if (this.keyboardSub) this.keyboardSub.unsubscribe();
  }

  ngOnInit() {
    if (!this.eventProfile.categories?.length) this.eventProfile.categories = [];
    this.categoriesWithChildrenAux = this.allCategories;
    this.initForm();
  }

  ngAfterViewInit(): void {

    const controlBlurs: Observable<any>[] = this.formInputElements
      ? this.formInputElements.map((formControl: ElementRef) =>
          fromEvent(formControl.nativeElement, 'blur')
        )
      : [];

    merge(this.form.valueChanges, ...controlBlurs)
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.checksValidations();
      });
    setTimeout(() => {
      this.search.nativeElement.focus();
    }, 500);
  }

  onCancel() {
    this.modalController.dismiss();
  }
  onSave() {
    this.eventsService.actualizarEvento({ categories: this.eventProfile.categories });
    this.modalController.dismiss();
  }
  seatCategories() {
    this.eventsService.seatCategories(this.eventProfile.id!,this.eventProfile.categories!)
    .subscribe({ next:() => this.onSave() })
  }

  onSelectedCategory(category: any) {
    if (category.children.length) {
      this.categoriesWithChildrenAux = category.children;
      this.filteredCategories = [];
      this.categoriesTree.push(category);
      this.form.get('search')?.setValue('');
      this.filterCategories('');
    }
  }

  onSelectedCategories(index: number, categories: any) {
    if (index >= 0) {
      if (index !== this.categoriesTree.length - 1)
        this.categoriesTree = this.categoriesTree.slice(
          index,
          this.categoriesTree.length - 1
        );
    } else this.categoriesTree = [];

    this.filteredCategories = [];
    this.categoriesWithChildrenAux = categories;

    this.form.get('search')?.setValue('');
    this.filterCategories('');
  }

  onKeyUp(event: KeyboardEvent) {
    const searchString = this.form.get('search')?.value;
    this.showSearch = true;
    this.filterCategories(searchString);
  }

  filterCategories(searchString: string) {
    const filteredData = this.categoriesWithChildrenAux.filter((item: any) =>
      item.eventCategoryTranslation.description
        .toLowerCase()
        .includes(searchString?.toLowerCase())
    );

    this.filteredCategories = filteredData;
  }

  updateChecked(event: any, category: any) {
    if (event.detail.checked) {
      this.eventProfile.categories = [category];
    } else {
      this.eventProfile.categories = [];
    }
  }


  deleteSelectedCategory(category: any) {
    const currentEvent = this.eventProfile;
    if (!currentEvent || !currentEvent.categories) return;
    const updatedCategories = currentEvent.categories.filter(c => c.id !== category.id);
    this.eventProfile.categories = updatedCategories;
  }

  findCategoriesById(categories: any, targetId: string) {
    for (const selectedCategory of this.eventProfile.categories!) {
      for (const category of categories) {
        if (category.id === targetId && selectedCategory.id === targetId) {
          return true;
        }
        if (category.children && category.children.length > 0) {
          const result: any = this.findCategoriesById(
            category.children,
            targetId
          );
          if (result) return true;
        }
      }
    }
    return false;
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

  private checksValidations() {
    this.displayMessage = this.genericValidator.processMessages(
      this.form,
      this.validationMessages
    );
  }
}
