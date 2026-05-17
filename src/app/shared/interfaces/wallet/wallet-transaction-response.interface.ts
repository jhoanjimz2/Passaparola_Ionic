import { WalletTransaction } from './wallet-transaction.interface';

export interface WalletTransactionsResponse {
  walletTransactions: WalletTransaction[];
  total: number;
}
