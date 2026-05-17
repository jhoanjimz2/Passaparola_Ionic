export interface Wallet {
  id?: string;
  name?: string;
  userId: string;
  status?: boolean;
  createdAt?: string;
  updatedAt?: string;
  countryCode?: string;
  prog?: number;
  default?: boolean;
  balance?: number;
  isRechargeWallet?: boolean;
  isInvestment?: boolean;
  isNik?: boolean;
}
