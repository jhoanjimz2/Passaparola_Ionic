import { Country } from '../country/country.interface';
import { PlaceSearchResult } from '../google-maps/place-search-result.interface';

export interface IResponseBusinessSuggestion {
  data: IBusinessSuggestion[];
  metadata: {
    page: number;
    total: number;
    lastPage: number;
  };
}

export interface IBusinessSuggestion {
  address: string;
  category: Category | any;
  country: Country | any;
  countryCode: string;
  description: string;
  email: string;
  latitude: string;
  longitude: string;
  name: string;
  owner: string;
  phoneNumber: string;
  urlImage: string;
  isActive?: boolean;
  validUntil?: Date;
  id?: string;
}

interface Category {
  createdAt: string;
  id: string;
  languageCode: string;
  name: string;
  updatedAt: string;
}

export interface IBSDataFlow {
  address: string;
  category: Category | any;
  country: Country | any;
  countryCode: string;
  description: string;
  email: string;
  name: string;
  owner: string;
  phoneNumber: string;
  pictureFile: Blob | undefined;
  pictureUrl: string;
  place: PlaceSearchResult | any;
}

export enum EStatus {
  all = 'all',
  active = 'active',
  inactive = 'inactive',
}

export type TStatus = 'all' | 'active' | 'inactive';
