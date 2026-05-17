import { CommonModule }               from '@angular/common';
import { Component, Input }           from '@angular/core';
import { ModalController }            from '@ionic/angular';
import { IonContent, IonIcon }        from "@ionic/angular/standalone";

@Component({
  selector: 'app-tag-request-actions',
  templateUrl: './tag-request-actions.component.html',
  styleUrls: ['./tag-request-actions.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonContent,
    CommonModule
  ],
})
export class TagRequestActionsComponent {
  @Input() request: any;


  constructor(
    private modalCtrl: ModalController
  ) {}

  close() {
    this.modalCtrl.dismiss(false)
  }
  accept() {
    this.modalCtrl.dismiss(true)
  }

}
