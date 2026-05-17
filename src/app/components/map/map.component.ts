import {
  Component,
  ViewChild,
  OnInit,
  Input,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Geolocation, Position } from '@capacitor/geolocation';

import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Loader } from '@googlemaps/js-api-loader';

import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { LocationMarker } from 'src/app/shared/interfaces/map/location.interface';
import { Company } from 'src/app/shared/interfaces/company/company.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';
import { AuthenticationService } from 'src/app/core/service/authentication.service';

export const loader = new Loader({
  apiKey: 'AIzaSyBDseJJko8ruKTBRf8gOQAiH08c39m11XE',
  version: 'weekly',
  libraries: ['places', 'visualization', 'marker'],
});

@Component({
  selector: 'app-google-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @Output() clickOnMarker = new EventEmitter<any>();
  @Output() clickOnMarkerSuggestion = new EventEmitter<any>();

  user: User | Company | undefined;
  @ViewChild('myGoogleMap', { static: false }) map: GoogleMap | undefined;
  mapMarkers: any[] = [];
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
    // maxZoom: 18,
    minZoom: 0,
    center: this.center,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    mapId: 'AIzaSyBDseJJko8ruKTBRf8gOQAiH08c39m11XE',
  };

  @Input() position: Position = {} as Position;
  @Input() optionsPosition: PositionOptions = {
    maximumAge: 3000,
    timeout: 10000,
    enableHighAccuracy: true,
  };

  yourLocationMarker: any;

  @Input() suggestionMarkersLocation: LocationMarker[] = [];
  mapLoad = false;
  markers: google.maps.Marker[] = [];
  @Input() seatMarkersLocation: LocationMarker[] = [];

  markerClusterer: MarkerClusterer | undefined;

  constructor(
    private translate: TranslateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService
  ) {}

  async ngOnInit() {
    this.user = this.authenticationService.user;
    this.getCurrentLocation();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['position']) {
      if (this.map) this.getLocation(this.position!);
    }
    if (changes['suggestionMarkersLocation']) {
      if (this.map) {
        this.getLocation(this.position!);
      }
    }
    if (changes['seatMarkersLocation']) {
      if (this.map) {
        this.getLocation(this.position!);
      }
    }
  }

  async getCurrentLocation() {
    try {
      this.spinner.show();
      this.position = await Geolocation.getCurrentPosition(
        this.optionsPosition
      );
      this.mapLoad = true;
      this.getLocation(this.position);
    } catch (error) {
      this.mapLoad = true;
      this.spinner.hide();
      this.yourLocationMarker?.setMap(null);
      this.toastr.error(this.translate.instant('GENERAL.LOCATION_NOT_AVAIBLE'));
    }
  }

  async getLocation(position: Position) {
    this.yourLocationMarker?.setMap(null);
    if (position.coords) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      this.options = { ...this.options, center: this.center };
      this.setMarker(position.coords.latitude, position.coords.longitude);
    }
    this.spinner.hide();
    this.getSuggestionsMarkers();
    this.getSeatMarkersLocation();
  }

  async setMarker(lat: number, lng: number) {
    const iconUser = this.user?.profile?.profilePictureUrlFile;
    if (this.yourLocationMarker) this.yourLocationMarker.setMap(null);

    const img = document.createElement('img');
    img.src = iconUser ? iconUser : 'assets/images/logo.png';
    img.style.width = '2.813rem';
    img.style.height = '2.813rem';
    img.style.borderRadius = '50%';
    img.style.border = '0.125rem solid #ff8600';
    img.style.objectFit = 'cover';
    img.style.backgroundColor = 'white';

    this.yourLocationMarker = new google.maps.marker.AdvancedMarkerElement({
      map: this.map!.googleMap,
      position: new google.maps.LatLng(lat, lng),
      content: img,
    });

    const contentString =
      '<div>' +
      `<h2 class="text-center">${this.translate.instant(
        'GENERAL.YOUR_LOCATION'
      )}</h2>` +
      '<div>' +
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

  getSuggestionsMarkers() {
    if (this.markers.length > 0) {
      for (const marker of this.markers) {
        marker.setMap(null);
      }
    }

    const markers = this.suggestionMarkersLocation.map((position, i) => {
      const marker = new google.maps.Marker({
        position: position.position,
        icon: {
          url: 'assets/images/suggested-stores.svg',
          scaledSize: new google.maps.Size(38, 55, 'px', 'px'),
        },
      });

      marker.addListener('click', () => {
        this.clickOnMarkerSuggestion.emit(position.data);
      });

      this.markers.push(marker);
      return marker;
    });

    new MarkerClusterer({ markers, map: this.map!.googleMap });
  }

  getSeatMarkersLocation() {
    this.cleanMarkers();

    if (this.seatMarkersLocation.length === 0) {
      console.warn('No hay marcadores para mostrar.');
      return;
    }

    const markers = this.seatMarkersLocation.map((position, i) => {
      const marker = new google.maps.Marker({
        position: position.position,
        icon: {
          url: 'assets/images/active-stores.svg',
          scaledSize: new google.maps.Size(38, 55, 'px', 'px'),
          // size: new google.maps.Size(45, 45),
          // anchor: new google.maps.Point(22.5, 22.5),
        },
      });

      marker.addListener('click', () => {
        this.clickOnMarker.emit(position.data);
      });

      this.markers.push(marker);
      return marker;
    });

    this.markerClusterer = new MarkerClusterer({
      markers,
      map: this.map!.googleMap,
    });
  }

  cleanMarkers() {
    for (const marker of this.markers) {
      marker.setMap(null);
    }
    this.markers = [];

    if (this.markerClusterer) {
      this.markerClusterer.clearMarkers();
      this.markerClusterer = undefined;
    }
  }
}
