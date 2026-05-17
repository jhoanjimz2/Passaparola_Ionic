import { DataTranslation } from '../general/data-translation';

export interface CompanyType {
  id: string;
  description: string;
  languageCode: string;
  createdAt: string;
  updatedAt: string;
  companyTypeTranslation: DataTranslation[];
}
