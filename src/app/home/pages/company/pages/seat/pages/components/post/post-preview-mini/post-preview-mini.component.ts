import { Component, Input } from '@angular/core';
import { CommonModule }     from '@angular/common';
import { IonIcon }          from '@ionic/angular/standalone';

@Component({
  selector: 'app-post-preview-mini',
  templateUrl: './post-preview-mini.component.html',
  styleUrls: ['./post-preview-mini.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon
  ]
})
export class PostPreviewMiniComponent {
  @Input() post: any;
}
