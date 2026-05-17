import { Component, Input, OnInit } from '@angular/core';
import { IBusinessSuggestion } from 'src/app/shared/interfaces/business-suggestion/business-suggestion.interface';

@Component({
  selector: 'app-business-suggestion-card',
  templateUrl: './business-suggestion-card.component.html',
  styleUrls: ['./business-suggestion-card.component.scss'],
})
export class BusinessSuggestionCardComponent implements OnInit {
  @Input('businessSuggestion') businessSuggestion!: IBusinessSuggestion;

  constructor() {}

  ngOnInit() {}
}
