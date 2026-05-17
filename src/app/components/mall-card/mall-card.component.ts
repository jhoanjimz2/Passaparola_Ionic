import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mall-card',
  templateUrl: './mall-card.component.html',
  styleUrls: ['./mall-card.component.scss'],
})
export class MallCardComponent implements OnInit {
  cards: any[] = [{}, {}, {}, {}, {}];

  constructor() {}

  ngOnInit() {}
}
