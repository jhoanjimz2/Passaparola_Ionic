import { Country } from '../../country/country.interface';

export interface LoginResponse {
  id: string;
  prog: number;
  email?: any;
  phoneNumber: string;
  userID: string;
  status: boolean;
  pinActive: boolean;
  createdAt: string;
  updatedAt: string;
  country: Country;
  token: string;
}
