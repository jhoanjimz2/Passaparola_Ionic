import { Country } from '../country/country.interface';

export interface Profile {
  id?: string;
  name?: string;
  lastName?: string;
  username?: string;
  dateBirth?: string;
  taxNumber?: string;
  countryResidenceId?: string;
  residenceAddress?: string;
  homeCountryId?: string;
  homeAddress?: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  countryResidence?: Country;
  homeCountry?: Country;
  idCardUrlFile?: string;
  proofResidencyUrlFile?: string;
  idCardVerified?: boolean;
  proofResidencyVerified?: boolean;
  profilePictureUrlFile?: string;
  socialCommunityUserPreferences?: [];
  socialCommunityOficialPreferences?: [];
}
