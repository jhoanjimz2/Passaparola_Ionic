import { Component, OnInit } from '@angular/core';
import { Position, Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-passaparola-cash',
  templateUrl: './passaparola-cash.component.html',
  styleUrls: ['./passaparola-cash.component.scss'],
})
export class PassaparolaCashComponent implements OnInit {
  position: Position = {} as Position;

  constructor() {}

  async ngOnInit() {
    this.position = {} as Position;
    this.position = await Geolocation.getCurrentPosition({
      maximumAge: 3000,
      timeout: 10000,
      enableHighAccuracy: true,
    });
  }
}
