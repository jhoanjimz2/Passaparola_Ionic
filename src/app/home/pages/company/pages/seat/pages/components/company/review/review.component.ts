import { CommonModule }      from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule }       from '@ionic/angular';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
  imports: [
    IonicModule,
    CommonModule
  ],
  standalone: true
})
export class ReviewComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
