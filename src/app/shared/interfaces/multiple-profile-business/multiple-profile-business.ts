export interface MultipleProfileBusiness {
  id?:                  string;
  name?:                string;
  username?:            string;
  description?:         string;
  webAddress?:          string;
  address?:             string;
  latitude?:            string;
  longitude?:           string;
  status?:              boolean;
  countryCode?:         string;
  pictureUlrFile?:      string;
  coverUrlFile?:        string;
  pictureGallery?:      string[];
  tags?:                string[];
  rewardPercentage?:    number;
  cashBackPercentage?:  number;
  helpPercentage?:      number;
  drawingPercentage?:   number;
  communityPercentage?: number;
  pointsPercentage?:    number;
  phone?:               string;
  clientsType?:         ClientsType[];
  categories?:          Category[];
  prog?:                number;
  isVisible?:           boolean;
  schedule?:            MultipleProfileBusinessSchedule[];
  walletId?:            string;
  isSuggested?:         boolean;
  createdAt?:           Date;
  updatedAt?:           Date;
  country?:             Country;
  type?:                Type;
}

export interface Category {
  id?:                         string;
  status?:                     boolean;
  children?:                   any[];
  parentId?:                   string;
  createdAt?:                  Date;
  updatedAt?:                  Date;
  description?:                string;
  minimumPercentage?:          number;
  suggestedPercentage?:        number;
  companyCategoryTranslation?: CompanyCategoryTranslation;
}

export interface CompanyCategoryTranslation {
  id?:           string;
  description?:  string;
  languageCode?: string;
  relation?:     string;
}

export interface ClientsType {
  id?:                               string;
  description?:                      string;
  companySeatClientTypeTranslation?: CompanyCategoryTranslation[];
}

export interface Country {
  id?:           string;
  code?:         string;
  phonePrefix?:  string;
  name?:         string;
  languageCode?: string;
}

export interface MultipleProfileBusinessSchedule {
  isOpen?:    boolean;
  schedule?:  ScheduleSchedule[];
  dayOfWeek?: CompanyCategoryTranslation;
}

export interface ScheduleSchedule {
  end?:       string;
  start?:     string;
  hourEnd?:   string[];
  hourStart?: string[];
}

export interface Type {
  id?:                         string;
  description?:                string;
  companySeatTypeTranslation?: CompanyCategoryTranslation[];
}


export interface Menu {
  id?:        string;
  title?:     string;
  items?:     MenuItem[];
  status?:    boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MenuItem {
  amount?:      string;
  description?: string;
  productName?: string;
}
