import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-publicity-card',
  templateUrl: './publicity-card.component.html',
  styleUrls: ['./publicity-card.component.scss'],
})
export class PublicityCardComponent implements OnInit {
  @Input() image = 'assets/images/invite_2.png';

  constructor() {}

  ngOnInit() {}
}
