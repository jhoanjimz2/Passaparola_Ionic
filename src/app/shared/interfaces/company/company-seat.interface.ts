import { Wallet } from '../wallet/wallet.interface';
import { ICategory } from './category.interface';

export interface CompanySeat {
  id?: string;
  name?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  status?: number;
  countryCode?: boolean;
  pictureUlrFile?: string;
  coverUrlFile?: string;
  pictureGallery?: string[];
  tags?: string[];
  rewardPercentage?: number;
  cashBackPercentage?: number;
  helpPercentage?: number;
  drawingPercentage?: number;
  communityPercentage?: number;
  pointsPercentage?: number;
  phone?: string;
  pin?: string;
  wallet?: Wallet;
  categories: ICategory[];
}
