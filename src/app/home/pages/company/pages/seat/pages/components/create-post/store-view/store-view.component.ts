import { Component, Input, OnDestroy }   from '@angular/core';
import { Position }                      from '@capacitor/geolocation';
import { ModalController }               from '@ionic/angular';
import { IonContent }                    from "@ionic/angular/standalone";
import { StoreTagComponent }             from 'src/app/home/pages/company/pages/seat/pages/components/tags/store-tag/store-tag.component';

@Component({
  selector: 'app-store-view',
  templateUrl: './store-view.component.html',
  styleUrls: ['./store-view.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    StoreTagComponent
  ]
})
export class StoreViewComponent implements OnDestroy{
  @Input() seat: any;
  @Input() position: Position = {} as Position;

  constructor(
    private modalCtrl: ModalController
  ) {}
  ngOnDestroy(): void {
  }

  select() {
    this.modalCtrl.dismiss({
      seat: this.seat
    })
  }

}
