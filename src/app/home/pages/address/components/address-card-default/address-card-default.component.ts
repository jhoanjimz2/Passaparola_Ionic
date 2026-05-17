import { Component, OnDestroy, Output, EventEmitter }                  from '@angular/core';
import { ModalController, NavController }                              from '@ionic/angular';
import { CommonModule }                                                from '@angular/common';
import { Observable, Subscription }                                    from 'rxjs';
import { Address }                                                     from 'src/app/shared/interfaces/address/address.interface';
import { AddressService }                                              from 'src/app/shared/services/address.service';

@Component({
  selector: 'app-address-card-default',
  templateUrl: './address-card-default.component.html',
  styleUrls: ['./address-card-default.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class AddressCardDefaultComponent implements OnDestroy {
  @Output() defaultAddressSelected = new EventEmitter<Address>();

  address: Address = {} as Address;
  addresses: Address[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private addressService: AddressService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {
    this.addressService.getAllMyAddress().subscribe();
    this.autoSubscribe(
      this.addressService.myAddresses(),
      v => {
        this.addresses = v;
        this.selectDefaultAddress();
      }
    );
  }

  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }

  private selectDefaultAddress() {
    const defaultAddress = this.addresses.find(addr => addr.defaultAddress === true);
    if (defaultAddress) {
      this.address = defaultAddress;
      this.defaultAddressSelected.emit(defaultAddress);
    } else if (this.addresses.length > 0) {
      this.address = this.addresses[0];
      this.defaultAddressSelected.emit(this.addresses[0]);
    } else {
      // No hay direcciones disponibles
      this.address = {} as Address;
      this.defaultAddressSelected.emit(null as any);
    }
  }

  hasAddresses(): boolean {
    return this.addresses.length > 0 && this.address && Object.keys(this.address).length > 0;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  async editAddress() {
    const modal = await this.modalCtrl.getTop();
    if (modal) this.modalCtrl.dismiss();
    this.navCtrl.navigateForward(['/pages/address/addresses']);
  }

  async addNewAddress() {
    const modal = await this.modalCtrl.getTop();
    if (modal) await this.modalCtrl.dismiss();
    this.navCtrl.navigateForward(['/pages/address/addresses']);
  }
}
