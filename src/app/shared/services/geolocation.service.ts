import { Injectable } from '@angular/core';

import { Geolocation, Position } from '@capacitor/geolocation';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { GeoPointModel } from '../interfaces/map/GeoPoint';
import { Platform } from '@angular/cdk/platform';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  myLocation: Position = {} as Position;
  watchId!: string;
  private currentPosition!: GeoPointModel;

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService,
    private platform: Platform
  ) {}

  async startWatchingPosition(callback: (position: any) => void) {
    try {
      this.watchId = await Geolocation.watchPosition({}, (position, err) => {
        if (err) {
          console.error('Error watching position:', err);
          return;
        }
        callback(position);
      });
    } catch (error) {
      console.error('Error starting watch position:', error);
    }
  }

  async stopWatchingPosition() {
    if (this.watchId) {
      await Geolocation.clearWatch({ id: this.watchId });
    }
  }

  async getLocation(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const permisions = await Geolocation.checkPermissions();
      if (permisions.location === 'denied') {
        this.toastr.error(
          this.translate.instant('GENERAL.LOCATION_NOT_AVAIBLE')
        );
        resolve(null);
      }

      Geolocation.getCurrentPosition()
        .then(async (resp) => {
          this.currentPosition = {
            longitude: resp.coords.longitude,
            latitude: resp.coords.latitude,
            accuracy: resp.coords.accuracy,
          };
          this.myLocation = resp;
          resolve(this.myLocation);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getCoordintes(data: any) {
    const coordinates = data.map((coordinate: any) => {
      return {
        latitude: coordinate.latitude ? parseFloat(coordinate.latitude) : 0,
        longitude: coordinate.latitude ? parseFloat(coordinate.longitude) : 0,
        accuracy: 0,
        distance: 0,
      };
    });

    return coordinates;
  }

  orderListByLocation(list: GeoPointModel[], location: GeoPointModel) {
    for (let l of list) {
      l.distance = this.getDistance(
        l.latitude,
        l.longitude,
        location.latitude,
        location.longitude,
        'km'
      );
    }

    list.sort((a, b) => {
      const dist1 = a.distance ? a.distance : 0;
      const dist2 = b.distance ? b.distance : 0;
      if (dist1 < dist2) {
        return -1;
      }
      if (dist1 > dist2) {
        return 1;
      }
      return 0;
    });
    return list;
  }

  public getDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
    unit: 'km' | 'm' = 'km'
  ): number {
    lat1 = this.degreesToRadians(lat1);
    lon1 = this.degreesToRadians(lon1);
    lat2 = this.degreesToRadians(lat2);
    lon2 = this.degreesToRadians(lon2);

    const RADIO_TIERRA_EN_KILOMETROS = unit === 'km' ? 6371 : 6371 * 1000;
    let diferenciaEntreLongitudes = lon2 - lon1;
    let diferenciaEntreLatitudes = lat2 - lat1;
    let a =
      Math.pow(Math.sin(diferenciaEntreLatitudes / 2.0), 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.pow(Math.sin(diferenciaEntreLongitudes / 2.0), 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return RADIO_TIERRA_EN_KILOMETROS * c;
  }

  private degreesToRadians = (grados: number) => {
    return (grados * Math.PI) / 180;
  };

  async howToGet(item: GeoPointModel) {
    let url: string = '';

    if (!this.currentPosition) {
      // this.snackBar.open(this.translate.instant('GETTING_YOUR_LOCATION'), 'X', {
      //   duration: 3000,
      // });
      await this.getLocation();
    }
    if (this.currentPosition) {
      if (this.platform.isBrowser) {
        url =
          'https://maps.google.com/maps?saddr=' +
          this.currentPosition.latitude +
          ',' +
          this.currentPosition.longitude +
          ' &daddr=' +
          item.latitude +
          ',' +
          item.longitude;
      } else {
        url =
          'https://maps.google.com/maps?saddr=' +
          this.currentPosition.latitude +
          ',' +
          this.currentPosition.longitude +
          ' &daddr=' +
          item.latitude +
          ',' +
          item.longitude;
      }
      window.open(url, '_system');
    }
  }
}
