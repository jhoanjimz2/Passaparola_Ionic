export interface CompanyScheduleDay {
  id:          string;
  description: string;
  order:       number;
  companyScheduleDayTranslation: CompanyScheduleDayTranslation[];
}

export interface CompanyScheduleDayTranslation {
  id:           string;
  description:  string;
  relation:     string;
  languageCode: string;
}
