import { ICategory } from '../category.interface';

export interface CategoriesResponse {
  data: ICategory[];
  metadata: Metadata;
}

interface Metadata {
  page: number;
  total: number;
  lastPage: number;
}
