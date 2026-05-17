import { CommonModule } from '@angular/common';
import { Component }    from '@angular/core';
import { IonicModule }  from '@ionic/angular';

@Component({
  selector: 'app-product-slide',
  templateUrl: './product-slide.component.html',
  styleUrls: ['./product-slide.component.scss'],
  imports: [
    IonicModule,
    CommonModule
  ],
  standalone: true
})
export class ProductSlideComponent {

}
