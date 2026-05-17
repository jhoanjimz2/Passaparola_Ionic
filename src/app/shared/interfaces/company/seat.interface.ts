import { Country } from '../country/country.interface';
import { Profile } from '../user/profile.interface';

export interface Seat {
  name?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  status?: boolean;
  countryCode?: string;
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
  type?: string;
  country?: Country;
  profile?: Profile;
}
