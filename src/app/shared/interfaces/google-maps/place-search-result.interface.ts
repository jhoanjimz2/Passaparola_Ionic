export interface PlaceSearchResult {
  address: string;
  location?: google.maps.LatLng;
  imgUrl?: string;
  iconUrl?: string;
  name?: string;
  center?: { lat: number; lng: number };
}
