export interface WithdrawTransfer {
  iban: string;
  transactionId: string;
  status: boolean;
  isExecuted: boolean;
  amount: number;
  userId: string;
  walletFrom: string;
  walletTo?: string;
  countryCode: string;
  id?: string;
}
