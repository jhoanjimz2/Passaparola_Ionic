import { CommonModule }                              from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { IonicModule }                               from '@ionic/angular';
import { RatingComponent }                           from '../rating/rating.component';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    RatingComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true
})
export class ReviewsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
