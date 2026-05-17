import { Component, OnInit } from '@angular/core';
import { IonIcon }           from '@ionic/angular/standalone';

@Component({
  selector: 'app-modal-preview',
  templateUrl: './modal-preview.component.html',
  styleUrls: ['./modal-preview.component.scss'],
  standalone: true,
  imports: [
    IonIcon
  ]
})
export class ModalPreviewComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
