import { MyFriend } from '../community/summary-friends.interface';

export interface WorldRewardPoints {
  id: string;
  rewardPoints: number;
  rewardPointsRange: string;
  level: number;
  percentage: number;
  rewardPointsFrom: number;
  rewardPointsTo: number;
  countries: string[];
  band: string;
  color: string;
  friendsBylevel?: MyFriend[];
  earnings?: number;
}
