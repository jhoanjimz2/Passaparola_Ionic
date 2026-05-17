import { CommonModule }                           from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonIcon }                                from '@ionic/angular/standalone';

@Component({
  selector: 'app-tag-request',
  templateUrl: './tag-request.component.html',
  styleUrls: ['./tag-request.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    CommonModule
]
})
export class TagRequestComponent {
  @Output() actions: EventEmitter<'reject' | 'accept' | 'delete' | 'view'> = new EventEmitter<'reject' | 'accept' | 'delete' | 'view'>();
  @Input() request: any;

  constructor() {}

  ngOnInit() {
    // console.log(this.request)
  }

  action(type: 'reject' | 'accept' | 'delete' | 'view') {
    this.actions.emit(type)
  }
}

