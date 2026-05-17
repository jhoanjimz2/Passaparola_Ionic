import { SummaryCommunity } from 'src/app/shared/interfaces/community/summary-friends.interface';
import { User } from 'src/app/shared/interfaces/user/user.interface';

export interface Friend {
  name: string;
  date: string;
  img: string;
  summary: SummaryCommunity;
  user: User;
  earnings: number;
}
