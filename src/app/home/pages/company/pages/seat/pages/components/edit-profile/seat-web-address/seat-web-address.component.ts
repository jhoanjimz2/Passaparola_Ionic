import { CommonModule }                      from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormControlName,
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { ModalController }                   from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable,                         fromEvent, merge, debounceTime, Subscription } from 'rxjs';
import { SocialSummary }                     from 'src/app/shared/interfaces/multiple-profile-business/social-summary';
import { SocialService }                     from 'src/app/shared/services/social.service';

import { GenericValidator }                  from 'src/app/shared/validators/generic-validator';

@Component({
  selector: 'app-seat-web-address',
  templateUrl: './seat-web-address.component.html',
  styleUrls: ['./seat-web-address.component.scss'],
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, CommonModule],
})
export class SeatWebAddressComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  @ViewChild('webAddress') webAddress!: ElementRef;

  displayMessage: any = {};
  form: FormGroup = {} as FormGroup;
  validationMessages: any;

  private genericValidator!: GenericValidator;

  subscriptions: Subscription[] = [];
  seat: SocialSummary = {} as SocialSummary;

  constructor(
    private translate: TranslateService,
    private modalController: ModalController,
    private formBuild: FormBuilder,
    private socialService: SocialService
  ) {
    this.genericValidator = new GenericValidator();
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
      this.webAddress.nativeElement.focus();
    }, 500);
  }

  onSave() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.checksValidations();
      return;
    }

    const webAddress = this.form.get('webAddress')?.value.trim();

    this.modalController.dismiss({
      webAddress,
    });
  }

  onCancel() {
    this.modalController.dismiss();
  }

  private initForm() {
    this.validationMessages = {
      webAddress: {
        required: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
      },
    };

    this.form = this.formBuild.group({
      webAddress: [
        this.seat.targetInfo?.seatInfo?.webAddress ? this.seat.targetInfo?.seatInfo?.webAddress : '',
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
