export interface TransferATMResponse {
  id: string;
  walletFrom: string;
  walletTo: string;
  amount: number;
  rewardPercentage: number;
  cashBackPercentage: number;
  helpPercentage: number;
  drawingPercentage: number;
  communityPercentage: number;
  pointsPercentage: number;
  cashBackAmount: number;
  helpAmount: number;
  drawingAmount: number;
  communityAmount: number;
  rewardPoints: number;
  totalPercentage: number;
  amountNet: number;
  win: number;
  typeOperation: string;
  status: number;
  reason: string;
  reasonTranslated: string;
  createdAt: string;
  updatedAt: string;
}
