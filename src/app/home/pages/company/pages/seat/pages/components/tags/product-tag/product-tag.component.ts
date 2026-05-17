import { CommonModule }      from '@angular/common';
import { Component, Input }  from '@angular/core';
import { IonIcon }           from '@ionic/angular/standalone';
import { FormattNumberPipe } from 'src/app/shared/pipes';

@Component({
  selector: 'app-product-tag',
  templateUrl: './product-tag.component.html',
  styleUrls: ['./product-tag.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    CommonModule,
    FormattNumberPipe
]
})
export class ProductTagComponent {
  @Input() product:any;
  @Input() viewTagPost: boolean = false;
  @Input() showDetail: boolean = false;

}
