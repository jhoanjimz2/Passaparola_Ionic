import { Wallet } from '../wallet/wallet.interface';

export interface BankCard {
  brand: string;
  cardNumber: string;
  expiration: string;
  owner: string;
  customer: string;
  id: string;
}

export type PaymentSelection =
  | { type: 'wallet'; wallet: Wallet }
  | { type: 'card'; card: BankCard };
