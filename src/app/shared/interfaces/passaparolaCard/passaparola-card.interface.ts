import { Wallet } from '../wallet/wallet.interface';

export interface PassaparolaCard {
  id: string;
  cardNumber: string;
  yearExpired: number;
  monthExpire: number;
  cvc: number;
  countryCode: string;
  prog: number;
  status?: boolean;
  isAssing?: boolean;
  wallet: Wallet;
  createdAt?: string;
  updatedAt?: string;
}
