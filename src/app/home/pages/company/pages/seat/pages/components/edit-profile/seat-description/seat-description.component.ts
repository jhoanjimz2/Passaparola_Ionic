import { CommonModule }                      from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Capacitor }                         from '@capacitor/core';
import { Keyboard }                          from '@capacitor/keyboard';
import { ModalController }                   from '@ionic/angular';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable,                         fromEvent, merge, debounceTime, Subscription } from 'rxjs';
import { SocialSummary }                     from 'src/app/shared/interfaces/multiple-profile-business/social-summary';
import { SocialService }                     from 'src/app/shared/services/social.service';

import { GenericValidator }                  from 'src/app/shared/validators/generic-validator';

@Component({
  selector: 'app-seat-description',
  templateUrl: './seat-description.component.html',
  styleUrls: ['./seat-description.component.scss'],
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, CommonModule],
})
export class SeatDescriptionComponent implements OnInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  @ViewChild('description') description!: ElementRef;

  displayMessage: any = {};
  form: FormGroup = {} as FormGroup;
  validationMessages: any;

  private genericValidator!: GenericValidator;
  private showListener: any;
  private hideListener: any;
  keyboardIsOpen = false;

  subscriptions: Subscription[] = [];
  seat: SocialSummary = {} as SocialSummary;

  constructor(
    private translate: TranslateService,
    private modalController: ModalController,
    private formBuild: FormBuilder,
    private socialService: SocialService
  ) {
    this.genericValidator = new GenericValidator();
    if (Capacitor.isNativePlatform()) {
      this.showListener = Keyboard.addListener('keyboardWillShow', () => {
        this.keyboardIsOpen = true;
      });

      this.hideListener = Keyboard.addListener('keyboardWillHide', () => {
        this.keyboardIsOpen = false;
      });
    }
    this.autoSubscribe(this.socialService.seatObservable, v => this.seat = v);
  }
  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy() {
    this.showListener?.remove?.();
    this.hideListener?.remove?.();
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements.map(
      (formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur')
    );

    merge(this.form.valueChanges, ...controlBlurs)
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.checksValidations();
      });

    setTimeout(() => {
      this.description.nativeElement.focus();
    }, 500);
  }

  onSave() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.checksValidations();
      return;
    }

    const description = this.form.get('description')?.value.trim();

    this.modalController.dismiss({
      description,
    });
  }

  onCancel() {
    this.modalController.dismiss();
  }

  private initForm() {
    this.validationMessages = {
      description: {
        required: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
      },
    };

    this.form = this.formBuild.group({
      description: [
        this.seat.targetInfo?.seatInfo?.description ? this.seat.targetInfo?.seatInfo?.description : '',
        [Validators.required],
      ],
    });
  }

  private checksValidations() {
    this.displayMessage = this.genericValidator.processMessages(
      this.form,
      this.validationMessages
    );
  }
}
