import { CommonModule }                 from '@angular/common';
import { Component, OnInit }            from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule }              from '@ngx-translate/core';
import { SessionService }               from 'src/app/shared/services/session.service';

@Component({
  selector: 'app-seat-message-no-visible',
  templateUrl: './seat-message-no-visible.component.html',
  styleUrls: ['./seat-message-no-visible.component.scss'],
  standalone: true,
  imports: [IonicModule, TranslateModule, CommonModule],
})
export class SeatMessageNoVisibleComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    public sessionService: SessionService
  ) {}

  ngOnInit() {}

  onGoToModify() {
    this.modalController.dismiss({ goToModify: true });
  }

  onGoToAssistant() {
    this.modalController.dismiss({ goToAssistant: true });
  }
}
