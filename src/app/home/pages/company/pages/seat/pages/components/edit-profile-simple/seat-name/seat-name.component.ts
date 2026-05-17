import { CommonModule }                      from '@angular/common';
import {
  Component,
  ElementRef,
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

import { ModalController }                   from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable,                         fromEvent, merge, debounceTime, Subscription } from 'rxjs';
import { SocialSummary }                     from 'src/app/shared/interfaces/multiple-profile-business/social-summary';
import { SocialService }                     from 'src/app/shared/services/social.service';

import { GenericValidator }                  from 'src/app/shared/validators/generic-validator';

@Component({
  selector: 'app-seat-name',
  templateUrl: './seat-name.component.html',
  styleUrls: ['./seat-name.component.scss'],
  standalone: true,
  imports: [TranslateModule, ReactiveFormsModule, CommonModule],
})
export class SeatNameComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements!: ElementRef[];
  @ViewChild('name') name!: ElementRef;
  @ViewChild('lastName') lastName!: ElementRef;

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
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }


  ngOnInit() {
    this.initForm();
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
      this.name.nativeElement.focus();
    }, 500);
  }

  onSave() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.checksValidations();
      return;
    }

    const name = this.form.get('name')?.value.trim();
    const lastName = this.form.get('lastName')?.value.trim();

    this.modalController.dismiss({
      name,
      lastName,
    });
  }

  onCancel() {
    this.modalController.dismiss();
  }

  private initForm() {
    this.validationMessages = {
      name: {
        required: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
      },
      lastName: {
        required: this.translate.instant('ERROR_MESSAGE.REQUIRED'),
      },
    };

    this.form = this.formBuild.group({
      name: [this.seat.userInfo?.profile?.name ? this.seat.userInfo.profile.name : '', [Validators.required]],
      lastName: [this.seat.userInfo?.profile?.lastName ? this.seat.userInfo.profile.lastName : '', [Validators.required]],
    });
  }

  private checksValidations() {
    this.displayMessage = this.genericValidator.processMessages(
      this.form,
      this.validationMessages
    );
  }
}
