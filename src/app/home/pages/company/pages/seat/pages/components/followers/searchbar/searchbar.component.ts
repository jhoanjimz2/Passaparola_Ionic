import { CommonModule } from '@angular/common';
import { Component }    from '@angular/core';
import { IonicModule }  from '@ionic/angular';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  imports: [
    IonicModule,
    CommonModule
  ],
  standalone: true
})
export class SearchbarComponent {
}
