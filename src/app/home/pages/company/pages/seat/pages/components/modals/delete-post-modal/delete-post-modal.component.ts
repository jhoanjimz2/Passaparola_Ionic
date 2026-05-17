import { Component, Input } from '@angular/core';
import { CommonModule }             from '@angular/common';
import { ModalController }          from '@ionic/angular';
import { IonContent }               from '@ionic/angular/standalone';
import { PostPreviewMiniComponent } from '../../post/post-preview-mini/post-preview-mini.component';

@Component({
  selector: 'app-delete-post-modal',
  templateUrl: './delete-post-modal.component.html',
  styleUrls: ['./delete-post-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    PostPreviewMiniComponent
  ]
})
export class DeletePostModalComponent {
  @Input() post: any;

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    this.modalCtrl.dismiss(false);
  }

  confirmDelete() {
    this.modalCtrl.dismiss(true);
  }
}
