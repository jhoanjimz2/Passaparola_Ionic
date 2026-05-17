import { Country } from '../country/country.interface';
import { CompanyLegalType } from './company-legal-type.interface';
import { CompanySeat } from './company-seat.interface';
import { CompanyType } from './company-type.interface';
import { ProfileCompany } from './profile-company.interface';

// export interface Company {
//   email: string;
//   phoneNumber: string;
//   pin: string;
//   status: boolean;
//   pinActive: boolean;
//   promoCode: string;
//   countryCode: string;
//   storeType: string;
//   subCategories: string;
//   rol: string;
//   countryId: string;
//   categoryId: string;
//   profile: ProfileCompany;
//   appName: string;
//   companyTypeId: string;
//   userId?: string;
// }

export interface Company {
  id?: string;
  prog?: number;
  email?: string;
  phoneNumber?: string;
  userID?: string;
  pin?: string;
  status?: boolean;
  pinActive?: boolean;
  promoCode?: string;
  countryCode?: string;
  storeType?: string;
  subCategories?: null;
  rol?: string;
  createdAt?: string;
  updatedAt?: string;
  country?: Country;
  category?: null;
  profile?: ProfileCompany;
  type?: CompanyType;
  companyPassword?: CompanyPassword[];
  token?: string;
  // countryId?: string;
  // companyTypeId?: string;
  seat?: CompanySeat;
  legalType?: CompanyLegalType;
  freeNotification?: boolean;
  phoneNotificaction?: boolean;
  freeEmailNotificaction?: boolean;
  emails?: string[];
  phones?: string[];
}

interface CompanyPassword {
  id: string;
  pin: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Type {
  id: string;
  description: string;
  languageCode: string;
  createdAt: string;
  updatedAt: string;
}
