import { DataTranslation } from '../general/data-translation';

export interface CompanyLegalType {
  id: string;
  description?: string;
  languageCode?: string;
  createdAt?: string;
  updatedAt?: string;
  companyLegalTypeTranslation: DataTranslation[];
}
