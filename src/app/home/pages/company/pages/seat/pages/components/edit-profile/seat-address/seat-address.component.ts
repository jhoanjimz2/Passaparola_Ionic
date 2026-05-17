import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Geolocation }                                   from '@capacitor/geolocation';
import { Keyboard }                                      from '@capacitor/keyboard';
import { ReactiveFormsModule }                           from '@angular/forms';
import { IonicModule, ModalController }                  from '@ionic/angular';
import { GoogleMap, GoogleMapsModule }                   from '@angular/google-maps';
import { CommonModule }                                  from '@angular/common';

import { TranslateModule, TranslateService }             from '@ngx-translate/core';

import { MarkerMap }                                     from 'src/app/shared/interfaces/google-maps/marker-map.interface';
import { PlaceSearchResult }                             from 'src/app/shared/interfaces/google-maps/place-search-result.interface';
import { SocialSummary }                                 from 'src/app/shared/interfaces/multiple-profile-business/social-summary';
import { SocialService }                                 from 'src/app/shared/services/social.service';
import { Observable, Subscription }                      from 'rxjs';
import { Capacitor }                                     from '@capacitor/core';

@Component({
  selector: 'app-seat-address',
  templateUrl: './seat-address.component.html',
  styleUrls: ['./seat-address.component.scss'],
  standalone: true,
  imports: [
    GoogleMapsModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    CommonModule,
  ],
})
export class SeatAddressComponent implements OnInit, OnDestroy {
  @ViewChild('address') address!: ElementRef;
  @ViewChild('myGoogleMap', { static: false }) map!: GoogleMap;

  autocomplete!: google.maps.places.Autocomplete;

  mapMarkers: MarkerMap[] = [];
  latitude = 41.90433206255868;
  longitude = 12.487917467927856;
  zoom = 12;
  selected = true;
  center = {
    lat: this.latitude,
    lng: this.longitude,
  };
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    clickableIcons: false,
    zoomControl: false,
    maxZoom: 18,
    minZoom: 0,
    center: this.center,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
  };
  yourLocationMarker: google.maps.Marker | undefined;
  mapOptions: google.maps.MapOptions = {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  };
  markerPosition: google.maps.LatLngLiteral = { lat: -34.397, lng: 150.644 };
  autocompletePosition: google.maps.LatLngLiteral = {
    lat: -34.397,
    lng: 150.644,
  };
  place!: PlaceSearchResult;
  private showListener: any;
  private hideListener: any;
  keyboardIsOpen = false;

  subscriptions: Subscription[] = [];
  seat: SocialSummary = {} as SocialSummary;

  constructor(
    private translate: TranslateService,
    private modalController: ModalController,
    private socialService: SocialService
  ) {
    if (Capacitor.isNativePlatform()) {
      this.showListener = Keyboard.addListener('keyboardWillShow', () => {
        this.keyboardIsOpen = true;
      });

      this.hideListener = Keyboard.addListener('keyboardWillHide', () => {
        this.keyboardIsOpen = false;
      });
    }
    this.autoSubscribe(this.socialService.seatObservable, v => this.seat = v);
  }
  private autoSubscribe<T>(obs$: Observable<T>, setter: (v: T) => void) {
    const sub = obs$.subscribe(setter);
    this.subscriptions.push(sub);
  }
  async ngOnInit() {
    await this.getLocation();

    if (this.seat?.targetInfo?.seatInfo?.address) {
      this.address.nativeElement.value = this.seat.targetInfo?.seatInfo.address;

      setTimeout(() => {
        this.triggerPlaceChangedEvent(this.seat.targetInfo?.seatInfo!.address!);
      }, 500);
    }
  }

  ngOnDestroy() {
    this.showListener?.remove?.();
    this.hideListener?.remove?.();
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onSave() {
    this.modalController.dismiss({
      address: this.place.address,
      center: this.place.center,
    });
  }

  onCancel() {
    this.modalController.dismiss();
  }

  ngAfterViewInit() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.address?.nativeElement
    );

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      this.place = {
        address: this.address?.nativeElement.value,
        name: place?.name,
        location: place?.geometry?.location,
        iconUrl: place?.icon,
        imgUrl: this.getPhotoPlaceUrl(place),
        center: {
          lat: place?.geometry?.location?.lat()!,
          lng: place?.geometry?.location?.lng()!,
        },
      };

      this.setPLace({
        lat: this.place.location?.lat()!,
        lng: this.place.location?.lng()!,
      });
      this.address!.nativeElement.focus();
    });
  }

  triggerPlaceChangedEvent(addressString: string) {
    const place = {
      formatted_address: addressString,
      geometry: {
        location: new google.maps.LatLng(0, 0),
      },
    };

    google.maps.event.trigger(this.autocomplete, 'place_changed', { place });
  }

  async getLocation() {
    const options: PositionOptions = {
      maximumAge: 3000,
      timeout: 10000,
      enableHighAccuracy: true,
    };

    const position = await Geolocation.getCurrentPosition(options);

    if (position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.options = { ...this.options, center: this.center };
    }
  }

  setMarker(lat: number, lng: number) {
    this.yourLocationMarker = new google.maps.Marker({
      map: this.map!.googleMap,
      animation: google.maps.Animation.DROP,
      icon: {
        url: 'assets/images/logo.png',
        scaledSize: new google.maps.Size(22, 27, 'px', 'px'),
      },
      position: new google.maps.LatLng(lat, lng),
    });

    const contentString =
      '<div>' +
      `<h4 class="text-center">${this.translate.instant(
        'Indirizzo sede legale'
      )}</h4>` +
      '<div>' +
      `<p>${this.place?.address}</p>` +
      `<p>${this.latitude}; ${this.longitude}</p>` +
      '</div>' +
      '</div>';

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      ariaLabel: 'Uluru',
    });

    this.yourLocationMarker.addListener('click', () => {
      infowindow.open({
        anchor: this.yourLocationMarker,
        map: this.map!.googleMap,
      });
    });
  }

  async setPLace(position: { lat: number; lng: number }) {
    this.latitude = position.lat;
    this.longitude = position.lng;
    this.center = {
      lat: position.lat,
      lng: position.lng,
    };
    this.options = { ...this.options, center: this.center };

    this.mapMarkers = [];
    this.mapMarkers.push({
      position: this.center,
    });
  }

  getPhotoPlaceUrl(
    place: google.maps.places.PlaceResult | undefined
  ): string | undefined {
    return place?.photos && place?.photos?.length! > 0
      ? place?.photos[0].getUrl({ maxWidth: 500 })
      : undefined;
  }
}
