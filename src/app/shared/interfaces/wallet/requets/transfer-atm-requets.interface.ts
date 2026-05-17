import { Operations } from '../enum/operations.interfaces';
import { Reasons }    from '../enum/reasons.interfaces';

export interface TransferATMRequets {
  walletFrom: string;
  walletTo: string;
  amount: number;
  rewardPercentage?: number;
  cashBackPercentage?: number;
  helpPercentage?: number;
  drawingPercentage?: number;
  communityPercentage?: number;
  pointsPercentage?: number;
  typeOperation: Operations;
  status?: number;
  reason: Reasons;
  observation?: string;
  reasonStatusTransfer: Reasons;
  amountWithoutRewards?: number;
  isCash?: boolean;
  transactionType?: 'send' | 'receive';
  isDigitalObject?: boolean;
}
