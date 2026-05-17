import { CommonModule }             from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule }              from '@ionic/angular';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  imports: [
    IonicModule,
    CommonModule
  ],
  standalone: true
})
export class RatingComponent {
  @Input() rating: number = 4.9;
  @Input() totalReviews: number = 4124;
  @Input() distribution = [
    { stars: 5, count: 4000 },
    { stars: 4, count: 50 },
    { stars: 3, count: 74 },
    { stars: 2, count: 30 },
    { stars: 1, count: 20 },
  ];

  get maxCount(): number {
    return Math.max(...this.distribution.map(d => d.count));
  }
  get roundedRating(): number {
    return Math.round(this.rating);
  }

}
