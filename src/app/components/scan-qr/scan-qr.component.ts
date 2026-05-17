import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController, Platform }               from '@ionic/angular';
import { Camera }                                  from '@capacitor/camera';

import { NgxScannerQrcodeComponent }               from 'ngx-scanner-qrcode';

@Component({
  selector: 'app-scan-qr',
  templateUrl: './scan-qr.component.html',
  styleUrls: ['./scan-qr.component.scss'],
})
export class ScanQrComponent implements OnInit, OnDestroy {
  @ViewChild('action', { static: true })
  action!: NgxScannerQrcodeComponent;
  isActive = false;
  dataScan = '';
  zoom = 0;

  constructor(
    private modalController: ModalController,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.requestPermissionCamera();
    this.action.isReady.subscribe((res: any) =>
      this.handle(this.action, this.action.isStart ? 'stop' : 'start')
    );
  }

  ngOnDestroy() {
    this.action.stop();
    this.isActive = false;
  }

  scanner(data: any) {
    this.dataScan = data[0].value;
    this.action.stop();
    this.isActive = false;
    this.modalController.dismiss({ qrValue: this.dataScan });
  }

  handle(action: any, fn: string): void {
    try {
      this.dataScan = '';
      const playDeviceFacingBack = (devices: any[]) => {
        const device = devices.find((f) =>
          /back|rear|trasera|environment/gi.test(f.label)
        );
        const camera = devices[0].deviceId;
        action.playDevice(device ? device.deviceId : camera);
      };

      if (fn === 'start') {
        this.isActive = true;
        action[fn](playDeviceFacingBack).subscribe((r: any) =>
          console.info(fn, r)
        );
      } else {
        if (fn === 'stop') this.isActive = false;
        action[fn]().subscribe((r: any) => {
          console.info(fn, r);
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  zoomScan(action: 'in' | 'less' | 'zoom') {
    if (action === 'in') {
      this.zoom++;
      if (this.zoom > 3) this.zoom = 3;
    }

    if (action === 'less') {
      this.zoom--;
      if (this.zoom < 0) this.zoom = 0;
    }

    if (this.zoom === 0) {
      document.documentElement.style.setProperty('--height-scan', `86`);
      document.documentElement.style.setProperty('--width-scan', `100`);
    }

    if (this.zoom === 1) {
      document.documentElement.style.setProperty('--height-scan', `116`);
      document.documentElement.style.setProperty('--width-scan', `130`);
    }

    if (this.zoom === 2) {
      document.documentElement.style.setProperty('--height-scan', `146`);
      document.documentElement.style.setProperty('--width-scan', `160`);
    }

    if (this.zoom === 3) {
      document.documentElement.style.setProperty('--height-scan', `176`);
      document.documentElement.style.setProperty('--width-scan', `190`);
    }
  }

  async requestPermissionCamera() {
    const platforms = this.platform.platforms();
    if (platforms.includes('mobileweb')) {
      try {
        const result = await navigator.permissions.query({
          name: 'camera' as PermissionName,
        });
        if (result.state === 'granted') {
          console.info('navigator permissions camera granted');
          return;
        } else if (result.state === 'denied') {
          console.info('navigator permissions camera denied');
          const playDeviceFacingBack = () => {};
          this.action.start(playDeviceFacingBack).subscribe((r: any) => {
            this.action.stop();
          });
          return;
        } else {
          console.info('navigator permissions camera no requested');
          const playDeviceFacingBack = () => {};
          this.action.start(playDeviceFacingBack).subscribe((r: any) => {
            this.action.stop();
          });
          return;
        }
      } catch (error) {
        console.error(error);
        return;
      }
    }

    // capacitor android/ios
    const checkPermissions = await Camera.checkPermissions();
    console.info('checkPermissions Camera native', checkPermissions);
    if (checkPermissions) {
      if (checkPermissions.camera === 'granted') return;
    }
    const permission = await Camera.requestPermissions();
    console.info('Camera requestPermissions native:', permission);
  }
}
