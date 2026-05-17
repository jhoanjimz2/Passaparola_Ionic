import { CommonModule } from '@angular/common';
import { Component }    from '@angular/core';
import { IonicModule }  from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [
    IonicModule,
    CommonModule
  ],
  standalone: true
})
export class ChatComponent {

  constructor() { }

}
