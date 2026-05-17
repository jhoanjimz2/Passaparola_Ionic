export interface DailyCheckIn {
  id?: string;
  userId: string;
  amount: number;
  walletTo: string;
  walletFrom?: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
  countryCode: string;
  idWalletTransfer?: string;
}
