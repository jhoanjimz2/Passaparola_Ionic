import { Country } from '../country/country.interface';

export interface IResponseBankAccount {
  data: IBankAccount[];
  metadata: {
    page: number;
    total: number;
    lastPage: number;
  };
}

export interface IBankAccount {
  id?: string;
  bankName: string;
  owner: string;
  accountNumber: string;
  country: Country;
  code?: string;
  isFavorite?: boolean;
}
