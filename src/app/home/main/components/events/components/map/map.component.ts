import { Component, Input, OnChanges, OnInit, AfterViewInit, SimpleChanges, ViewChild, OnDestroy } from '@angular/core';
import { GoogleMap }                                                                               from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() latitude!: number;
  @Input() longitude!: number;
  @ViewChild('myGoogleMap', { static: false }) map!: GoogleMap;

  center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom = 12;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    clickableIcons: false,
    zoomControl: false,
    maxZoom: 18,
    minZoom: 0,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
  };

  markerEvent!: google.maps.Marker;

  ngOnInit(): void {
    this.updateCenter();
  }
  ngOnDestroy(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['latitude'] || changes['longitude']) {
      this.updateMap();
    }
  }

  ngAfterViewInit(): void {
    this.initMarker();
  }

  private updateCenter(): void {
    if (this.latitude && this.longitude) {
      this.center = { lat: this.latitude, lng: this.longitude };
      this.options = { ...this.options, center: this.center };
    }
  }

  private updateMap(): void {
    this.updateCenter();
    if (this.markerEvent) {
      this.markerEvent.setPosition(this.center);
    }
  }

  private initMarker(): void {
    this.markerEvent = new google.maps.Marker({
      map: this.map.googleMap!,
      animation: google.maps.Animation.DROP,
      icon: {
        url: 'assets/images/logo.png',
        scaledSize: new google.maps.Size(32, 32),
      },
      position: this.center,
    });

    const infowindow = new google.maps.InfoWindow({
      content: `<div><h4 class="text-center">Location Event</h4><p>${this.latitude}; ${this.longitude}</p></div>`
    });

    this.markerEvent.addListener('click', () => {
      infowindow.open({
        anchor: this.markerEvent,
        map: this.map.googleMap!,
      });
    });
  }
}
