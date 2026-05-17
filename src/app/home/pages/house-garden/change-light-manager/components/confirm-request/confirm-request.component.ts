import { Component }  from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon }    from '@ionic/angular/standalone';

@Component({
  selector: 'app-confirm-request',
  templateUrl: './confirm-request.component.html',
  styleUrls: ['./confirm-request.component.scss'],
  standalone: true,
  imports: [IonIcon, RouterLink]
})
export class ConfirmRequestComponent  {
}
