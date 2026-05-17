export interface CategoryProject {
  id:                         string;
  name:                       string;
  createdAt:                  null;
  updatedAt:                  null;
  projectCategoryTranslation: ProjectCategoryTranslation[];
}

export interface ProjectCategoryTranslation {
  id:           string;
  description:  string;
  languageCode: string;
}
