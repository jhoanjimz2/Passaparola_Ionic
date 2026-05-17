import { Component, ViewChild, OnInit, Input, ElementRef } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';

import { ModalController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';

import { TranslateService } from '@ngx-translate/core';
import { MarkerMap } from 'src/app/shared/interfaces/google-maps/marker-map.interface';
import { PlaceSearchResult } from 'src/app/shared/interfaces/google-maps/place-search-result.interface';
import { IBSDataFlow } from 'src/app/shared/interfaces/business-suggestion/business-suggestion.interface';

@Component({
  selector: 'app-address-on-the-map',
  templateUrl: './address-on-the-map.component.html',
  styleUrls: ['./address-on-the-map.component.scss'],
})
export class AddressOnTheMapComponent implements OnInit {
  @Input() dataFlow!: IBSDataFlow | any;

  @ViewChild('inputField') inputField!: ElementRef;
  autocomplete!: google.maps.places.Autocomplete;
  @ViewChild('myGoogleMap', { static: false }) map!: GoogleMap;

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

  constructor(
    private translate: TranslateService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    await this.getLocation();

    if (this.dataFlow?.place?.address) {
      this.inputField.nativeElement.value = this.dataFlow.place.address;
      this.place = this.dataFlow.place;
      this.setPLace({
        lat: this.place.location?.lat()!,
        lng: this.place.location?.lng()!,
      });
    }
  }

  onNextStep() {
    this.dataFlow.place = this.place;

    this.modalController.dismiss({
      nextStep: true,
      dataFlow: this.dataFlow,
    });
  }

  onPreviousStep() {
    this.modalController.dismiss({
      previousStep: true,
    });
  }

  ngAfterViewInit() {
    this.autocomplete = new google.maps.places.Autocomplete(
      this.inputField?.nativeElement
    );

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      this.place = {
        address: this.inputField?.nativeElement.value,
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
      this.inputField!.nativeElement.focus();
    });
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
    return place!.photos && place?.photos?.length! > 0
      ? place?.photos[0].getUrl({ maxWidth: 500 })
      : undefined;
  }
}
