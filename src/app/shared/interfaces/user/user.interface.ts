import { Country } from '../country/country.interface';
import { Profile } from './profile.interface';

export interface User {
  prog?: number;
  email?: string;
  phoneNumber?: string;
  userID?: string;
  country?: Country;
  countryID?: string;
  countryCode?: string;
  createdAt?: string;
  updatedAt?: string;
  pin?: string;
  id?: string;
  pinActive?: boolean;
  status?: boolean;
  appName?: string;
  profile?: Profile;
  wallet?: any;
  token?: string;
  promoCode?: string;
  rol?: string;
  freeNotification?: boolean;
  phoneNotificaction?: boolean;
  freeEmailNotificaction?: boolean;
  emails?: string[];
  phones?: string[];
}
