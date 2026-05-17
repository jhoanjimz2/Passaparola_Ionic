import { Component }                from '@angular/core';
import { IonContent }               from "@ionic/angular/standalone";
import { ComponentModule }          from 'src/app/components/component.module';
import { AddressCardComponent }     from '../../components/address-card/address-card.component';
import { RouterLink }               from '@angular/router';
import { AddressService }           from 'src/app/shared/services/address.service';
import { Observable, Subscription } from 'rxjs';
import { Address }                  from 'src/app/shared/interfaces/address/address.interface';
import { CommonModule }             from '@angular/common';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.page.html',
  styleUrls: ['./addresses.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    ComponentModule,
    AddressCardComponent,
    RouterLink,
    CommonModule
  ]
})
export class AddressesPage {

  addresses: Address[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private addressService: AddressService
  ) {
    this.addressService.getAllMyAddress().subscribe();
    this.autoSubscribe(this.addressService.myAddresses(), v => {
      this.addresses = v;
    });
  }
  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
