import { Win } from './win.interface';

export interface WinsResponse {
  wins: Win[];
  totalWins: number;
  total: number;
}
