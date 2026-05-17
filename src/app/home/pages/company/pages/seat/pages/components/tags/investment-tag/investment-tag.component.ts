import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon }                                from '@ionic/angular/standalone';
import { FormattNumberPipe }                      from 'src/app/shared/pipes';
import { CountdownPhaseComponent }                from '../../shared/countdown-phase/countdown-phase.component';
import { Project }                                from 'src/app/shared/interfaces/projects/project';
import { CommonModule }                           from '@angular/common';

@Component({
  selector: 'app-investment-tag',
  templateUrl: './investment-tag.component.html',
  styleUrls: ['./investment-tag.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    FormattNumberPipe,
    CountdownPhaseComponent,
  ]
})
export class InvestmentTagComponent {
  @Output() selectProjectTag: EventEmitter<Project> = new EventEmitter();
  @Input() project: Project = {} as Project;
  @Input() viewTagPost: boolean = false;
  @Input() tagga: boolean = false;
  @Input() investmentSelected: boolean = false;
  @Input() showDetail: boolean = false;

  date: Date = new Date(new Date().setDate(new Date().getDate() + 5));


  taggaAction() {
    this.selectProjectTag.emit(this.project)
  }

}
