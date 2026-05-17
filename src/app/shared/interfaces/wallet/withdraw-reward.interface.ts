export interface WithdrawReward {
  userId: string;
  status: boolean;
  walletFrom?: string;
  month?: number;
  year?: number;
  walletTo: string;
  amount: number;
  countryCode: string;
}
