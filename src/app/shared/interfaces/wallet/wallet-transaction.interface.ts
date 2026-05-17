export interface WalletTransaction {
  id: string;
  walletFrom: string;
  walletTo: string;
  amount: number;
  rewardPercentage: number;
  cashBackPercentage: number;
  helpPercentage: number;
  drawingPercentage: number;
  passaparolaPercentage: number;
  pointsPercentage: number;
  cashBackAmount: number;
  helpAmount: number;
  drawingAmount: number;
  passaparolaAmount: number;
  rewardPoints: number;
  totalPercentage: number;
  amountNet: number;
  win: number;
  typeOperation: string;
  status: number;
  reason: string;
  createdAt: string;
  updatedAt: string;
  reasonTranslated: Reason;
  observation?: string;
  reasonStatusTransferTranslated: Reason;
  reasonStatusTransfer: string;
  transactionType?: string;
  userIdFrom?: string;
  userIdTo?: string;
  isBussines?: boolean;
}

interface Reason {
  reason: string;
  reasonTranslated: string;
  languageCode: string;
  textColor: string;
  iconColor: string;
}
