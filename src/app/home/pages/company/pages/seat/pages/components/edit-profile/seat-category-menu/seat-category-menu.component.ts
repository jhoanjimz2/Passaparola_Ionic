import { CommonModule }                                            from '@angular/common';
import { Component, Input }                                        from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule }                                             from '@ionic/angular';
import { SocialSummary }                                           from 'src/app/shared/interfaces/multiple-profile-business/social-summary';

@Component({
  selector: 'app-seat-category-menu',
  templateUrl: './seat-category-menu.component.html',
  styleUrls: ['./seat-category-menu.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class SeatCategoryMenuComponent {
  @Input() seat: SocialSummary = {} as SocialSummary;
  form: FormGroup = {} as FormGroup;

  constructor(
    private formBuild: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.form = this.formBuild.group({
      name: [this.seat.targetInfo?.seatInfo?.name ? this.seat.targetInfo?.seatInfo?.name : '', [Validators.required]],
    });
  }

  onSave() {}

}
