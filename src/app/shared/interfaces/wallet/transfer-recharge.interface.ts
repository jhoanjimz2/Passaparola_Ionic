export interface TransferRecharge {
  id?: string;
  addressee: string;
  iban: string;
  bicSwift: string;
  transactionId: string;
  status?: boolean;
  isExecuted?: boolean;
  amount: number;
  userId?: string;
  walletTo: string;
  createdAt?: string;
  updatedAt?: string;
}
