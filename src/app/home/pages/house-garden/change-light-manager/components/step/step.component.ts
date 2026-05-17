import { CommonModule }                           from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class StepComponent {
  @Input() currentStep: number = 1;
  @Input() totalSteps: number = 4;
  @Output() stepChange = new EventEmitter<number>();
}
