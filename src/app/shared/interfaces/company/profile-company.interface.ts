import { Company } from './company.interface';

export interface ProfileCompany {
  id?: string;
  name: string;
  legalRepresentative?: string;
  legalAddress?: string;
  operativeAddress?: string;
  legalLatitude?: string;
  legalLongitude?: string;
  operativeLatitude?: string;
  operativeLongitude?: string;
  profilePictureUrlFile?: string;
  nameMap?: string;
  status?: boolean;
  legalRepresentativeFiscal?: string;
  iva?: string;
  rewardPercentage?: number;
  cashBackPercentage?: number;
  helpPercentage?: number;
  drawingPercentage?: number;
  communityPercentage?: number;
  pointsPercentage?: number;
  company?: Company;
  createdAt?: string;
  updatedAt?: string;
  seats?: any[];
  username?: string;
}
