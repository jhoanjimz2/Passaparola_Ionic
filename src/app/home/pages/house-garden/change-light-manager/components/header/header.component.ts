import { Component, Output, EventEmitter } from '@angular/core';
import { IonHeader, IonIcon, IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonIcon
  ]
})
export class HeaderComponent {
  @Output() backPressed = new EventEmitter<void>();

  onBackClick(): void {
    this.backPressed.emit();
  }
}
