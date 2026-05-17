import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController }                                            from '@ionic/angular';
import { MarkerMap }                                                  from 'src/app/shared/interfaces/google-maps/marker-map.interface';
import { PlaceSearchResult }                                          from 'src/app/shared/interfaces/google-maps/place-search-result.interface';
import { Geolocation }                                                from '@capacitor/geolocation';
import { GoogleMap }                                                  from '@angular/google-maps';
import { EventsService }                                              from 'src/app/shared/services';
import { Events, SeatLocation }                                       from 'src/app/shared/interfaces/events/events';
import { Subscription }                                               from 'rxjs';
import { KeyboardService }                                            from 'src/app/shared/services/keyboard.service';

@Component({
  selector: 'app-seat-location',
  templateUrl: './seat-location.component.html',
  styleUrls: ['./seat-location.component.scss'],
})
export class SeatLocationComponent  implements OnInit, OnDestroy {
  @ViewChild('inputWebAddress', { static: false }) inputWebAddress!: ElementRef;
  @ViewChild('inputAddress', { static: false }) inputAddress!: ElementRef;
  @ViewChild('myGoogleMap', { static: false }) map!: GoogleMap;

  @Input() address: string = '';
  @Input() latitude: string = '';
  @Input() longitude: string = '';
  @Input() webAddress: string = '';


  autocomplete!: google.maps.places.Autocomplete;
  placesService!: google.maps.places.PlacesService;
  mapMarkers: MarkerMap[] = [];
  place: PlaceSearchResult = {} as PlaceSearchResult;
  zoom = 12;
  selected = true;
  center = { lat: 0, lng: 0 };
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
  type: 'fisica' | 'online' = 'fisica';

  get valid(): boolean {
    const hasPlace = Object.keys(this.place).length > 0;
    const haswebAddress = this.inputWebAddress?.nativeElement?.value?.trim().length > 0;
    return hasPlace || haswebAddress;
  }


  private subscription!: Subscription;
  eventProfile: Events = {} as Events;

  isKeyboardOpen = false;
  private keyboardSub!: Subscription;

  constructor(
    private modalController: ModalController,
    private eventsService: EventsService,
    private keyboardService: KeyboardService
  ) {
    this.subscription = this.eventsService.obtenerEventSelect().subscribe({
      next: (events) => { this.eventProfile = events; }
    });
    this.keyboardSub = this.keyboardService.isKeyboardOpen$.subscribe(isOpen => {
      this.isKeyboardOpen = isOpen;
    });
  }
  async ngOnInit() {
    await this.getLocation();
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.keyboardSub) this.keyboardSub.unsubscribe();
  }
  ngAfterViewInit() {
    if (this.webAddress?.length) {
      this.type = 'online';
    } else {
      this.type = 'fisica';
      this.autocomplete = new google.maps.places.Autocomplete(this.inputAddress.nativeElement);
      this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
      this.cargarPlaces();
      this.buscarLugar(this.address);
    }
  }
  onOptionChange() {
    if (this.type == 'fisica') {
      this.address = '';
      setTimeout(() => {
        if (this.inputAddress) {
          this.autocomplete = new google.maps.places.Autocomplete(this.inputAddress.nativeElement);
          this.placesService = new google.maps.places.PlacesService(document.createElement('div'));
          this.cargarPlaces();
        }
      }, 100);
    }
    if (this.type == 'online') {
      this.place = {} as PlaceSearchResult;
      this.webAddress = '';
    }
  }
  onCancel() {
    this.modalController.dismiss();
  }
  onSave() {
    this.modalController.dismiss({
      data       : true,
      webAddress : this.inputWebAddress?.nativeElement?.value ?? '',
      address    : this.place?.address ?? '',
      latitude   : this.place?.center?.lat.toString() ?? '0',
      longitude  : this.place?.center?.lng.toString() ?? '0',
    });
  }
  seatLocation() {
    let location:SeatLocation = {} as SeatLocation;
    location = {
      webAddress : this.inputWebAddress?.nativeElement?.value ?? '',
      address    : this.place?.address ?? '',
      latitude   : this.place?.center?.lat.toString() ?? '0',
      longitude  : this.place?.center?.lng.toString() ?? '0',
    }
    this.eventsService.seatLocation(this.eventProfile.id!, location)
    .subscribe({
      next:() => { this.onSave() },
      error:() => {}
    })
  }
  cargarPlaces() {
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();
      if (!place.geometry || !place.geometry.location) return;
      this.actualizarLugar(place);
    });
  }
  buscarLugar(query: string) {
    const request = {
      query,
      fields: ['name', 'geometry', 'formatted_address', 'icon', 'photos'],
    };

    this.placesService.findPlaceFromQuery(request, (results: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results[0]?.geometry?.location) {
        this.actualizarLugar(results[0]);
      }
    });
  }
  actualizarLugar(place: any) {
    const lat = typeof place.geometry.location.lat === 'function' ? place.geometry.location.lat() : place.geometry.location.lat;
    const lng = typeof place.geometry.location.lng === 'function' ? place.geometry.location.lng() : place.geometry.location.lng;

    if (typeof lat !== 'number' || typeof lng !== 'number') return;

    this.place = {
      address: place.formatted_address,
      name: place.name,
      location: place.geometry.location,
      iconUrl: place.icon,
      imgUrl: place.photos?.[0]?.getUrl() || '',
      center: { lat, lng },
    };

    this.setPLace(lat, lng);
    this.inputAddress.nativeElement.focus();
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
      this.latitude = position.coords.latitude.toString()
      this.longitude = position.coords.longitude.toString()
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.options = { ...this.options, center: this.center };
    }
  }


  getPhotoPlaceUrl(
    place: google.maps.places.PlaceResult | undefined
  ): string | undefined {
    return place?.photos && place?.photos?.length! > 0
      ? place?.photos[0].getUrl({ maxWidth: 500 })
      : undefined;
  }

  setPLace(lat: number, lng: number) {
    this.latitude = lat.toString();
    this.longitude = lng.toString();
    this.center = { lat, lng };
    this.options = { ...this.options, center: this.center };
    this.mapMarkers = [];
    this.mapMarkers = [{ position: this.center }];
  }



}
