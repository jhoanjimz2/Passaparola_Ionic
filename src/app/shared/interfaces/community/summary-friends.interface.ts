export interface SummaryCommunity {
  friends: number;
  communityFriends: number;
  myFriends: MyFriend[];
  myFriendsOfFriends: MyFriend[];
  rewardPoints: number;
  myRewardPoints: number;
  worldRewardPoints?: WorldRewardPoints;
  countryCode: string;
  country: string;
  mySummaryCommunity?: MyFriend[];
  earnings?: number;
  nextWorldRewardPoints?: WorldRewardPoints;
  missingToNextLevel?: number;
  userId?: string;
  allFriends?: MyFriend[];
  myEarnings?: number;
  earningsFromFriends?: number;
  yourEarnings?: number;
}

export interface MyFriend extends SummaryCommunity {
  userId: string;
  countryCode: string;
  promoCode: string;
  friendsTotal: string;
  friendsIT: string;
  friendsES: string;
  createdAt: string;
  rewardPoints: number;
  worldRewardPoints: WorldRewardPoints;
  earnings: number;
}

interface WorldRewardPoints {
  id: string;
  rewardPoints: number;
  rewardPointsRange: string;
  level: number;
  percentage: number;
  rewardPointsFrom: number;
  rewardPointsTo: number;
  countries: string[];
  band: string;
}

// export interface SummaryCommunity {
//   friends: number;
//   communityFriends: number;
//   myFriends: MyFriend[];
//   myFriendsOfFriends: MyFriend[];
//   mySummaryCommunity: MyFriend[];
//   countryCode: string;
//   userId: string;
//   country: string;
// }

// interface MyFriend {
//   userId: string;
//   countryCode: string;
//   promoCode: string;
//   friendsTotal: string;
//   friendsIT: string;
//   friendsES: string;
//   createdAt: string;
// }
