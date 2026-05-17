import { CommonModule }                           from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon }                                from '@ionic/angular/standalone';
import { Events }                                 from 'src/app/shared/interfaces/events/events';
import { PipesModule }                            from 'src/app/shared/pipes/pipes.module';

@Component({
  selector: 'app-event-tag',
  templateUrl: './event-tag.component.html',
  styleUrls: ['./event-tag.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    PipesModule
  ]
})
export class EventTagComponent {
  @Output() selectEventTag: EventEmitter<Events> = new EventEmitter();
  @Input() event: Events = {} as Events;
  @Input() tagga: boolean = false;
  @Input() viewTagPost: boolean = false;
  @Input() eventSelected: boolean = false;
  @Input() showDetail: boolean = false;


  taggaAction() {
    this.selectEventTag.emit(this.event)
  }

}
