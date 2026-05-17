import { CommonModule }                               from '@angular/common';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule }                from '@angular/google-maps';
import { IonicModule }                                from '@ionic/angular';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  imports: [
    IonicModule,
    CommonModule,
    GoogleMapsModule
  ],
  standalone: true
})
export class LocationComponent implements AfterViewInit {
  @Input() latitude: number = 45.4684956;
  @Input() longitude: number = 9.1411174;

  @ViewChild('myGoogleMap') map!: GoogleMap;
  loadComponent: boolean = false;

  zoom = 15;
  center: google.maps.LatLngLiteral = { lat: this.latitude, lng: this.longitude };

  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    clickableIcons: false,
    gestureHandling: 'greedy',
    mapId: 'AIzaSyBDseJJko8ruKTBRf8gOQAiH08c39m11XE',
  };

  constructor() {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.center = {
        lat: this.latitude,
        lng: this.longitude,
      };
      this.loadComponent = true;
      setTimeout(() => {
        this.addMarker(this.latitude, this.longitude);
      }, 500);
    }, 1000);
  }

  private addMarker(lat: number, lng: number): void {
    if (this.map?.googleMap) {
      new google.maps.Marker({
        map: this.map.googleMap,
        animation: google.maps.Animation.DROP,
        icon: {
          url: 'assets/images/logo.png',
          scaledSize: new google.maps.Size(2, 2, 'rem', 'rem'),
        },
        position: new google.maps.LatLng(lat, lng),
      });
    }
  }
}
