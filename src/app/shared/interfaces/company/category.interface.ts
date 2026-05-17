import { DataTranslation } from '../general/data-translation';

export interface ICategory {
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  companyCategoryTranslation: DataTranslation[];
  minimumPercentage?: number;
  parentId?: string;
  status: boolean;
  suggestedPercentage?: number;
  children?: ICategory[];
  selected?: boolean;
}
