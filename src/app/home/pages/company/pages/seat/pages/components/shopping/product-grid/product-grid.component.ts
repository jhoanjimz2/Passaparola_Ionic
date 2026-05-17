import { CommonModule } from '@angular/common';
import { Component }    from '@angular/core';
import { IonicModule }  from '@ionic/angular';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss'],
  imports: [
    IonicModule,
    CommonModule
  ],
  standalone: true
})
export class ProductGridComponent {
}
