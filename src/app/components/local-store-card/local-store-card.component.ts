import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-local-store-card',
  templateUrl: './local-store-card.component.html',
  styleUrls: ['./local-store-card.component.scss'],
})
export class LocalStoreCardComponent implements OnInit {
  business = [
    { img: 'assets/images/stores.png', title: 'Negozi Fisici', url: '' },
    {
      img: 'assets/images/local-investment.png',
      title: 'Local Investing',
      url: '',
    },
    { img: 'assets/images/professional.png', title: 'Professionisti', url: '' },
    { img: 'assets/images/event.png', title: 'Eventi', url: '' },
  ];

  constructor() {}

  ngOnInit() {}
}
