// Interfaces para la respuesta del backend
export interface CategoryTranslation {
  id: string;
  description: string;
  languageCode: string;
}

export interface ProfessionalCategory {
  id: string;
  description: string; // descripción en inglés (principal)
  parentId: string | null;
  status: boolean;
  suggestedPercentage: number;
  minimumPercentage: number;
  createdAt: string;
  updatedAt: string;
  urlImage: string | null;
  shopCategoryTranslation?: CategoryTranslation[];
  categoryTranslations?: CategoryTranslation[];
}

// Helper para obtener el nombre traducido de una categoría
export function getCategoryName(category: ProfessionalCategory, languageCode: string = 'IT'): string {
  // Primero intenta con categoryTranslations
  const translation = category.categoryTranslations?.find(t => t.languageCode === languageCode);
  if (translation) {
    return translation.description;
  }

  // Luego intenta con shopCategoryTranslation (fallback)
  const shopTranslation = category.shopCategoryTranslation?.find(t => t.languageCode === languageCode);
  if (shopTranslation) {
    return shopTranslation.description;
  }

  // Si no hay traducción, usa la descripción principal
  return category.description;
}

export interface ProfessionalFilters {
  homeService: boolean | null;
  orderBy: 'cashback' | 'distance' | 'rating' | null;
  distance: number | null;
  rating: number | null;
  availability: 'now' | 'always' | null;
  minCashback: number | null;
}


export interface LoadProfessionals {
    data?:     Professional[];
    metadata?: Metadata;
}

export interface Professional {
    id?:                     string;
    prog?:                   number;
    email?:                  string;
    phoneNumber?:            string;
    userID?:                 string;
    status?:                 boolean;
    pinActive?:              boolean;
    promoCode?:              string;
    countryCode?:            string;
    rol?:                    string;
    emails?:                 null;
    phones?:                 null;
    freeNotification?:       boolean;
    freeEmailNotificaction?: boolean;
    phoneNotificaction?:     boolean;
    transactionBlocker?:     boolean;
    levelRange?:             number;
    createdAt?:              Date;
    updatedAt?:              Date;
    country?:                Country | null;
    type?:                   DatumType;
    profile?:                Profile;
    companyPassword?:        CompanyPassword[];
    legalType?:              null;
    events?:                 any[];
    products?:               any[];
}

export interface CompanyPassword {
    id?:        string;
    pin?:       string;
    status?:    boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Country {
    id?:           string;
    code?:         string;
    phonePrefix?:  string;
    name?:         string;
    languageCode?: string;
}

export interface Profile {
    id?:                                string;
    name?:                              string;
    legalRepresentative?:               string;
    legalAddress?:                      string;
    legalLatitude?:                     string;
    legalLongitude?:                    string;
    profilePictureUrlFile?:             string;
    status?:                            boolean;
    legalRepresentativeFiscal?:         string;
    iva?:                               string;
    rewardPercentage?:                  number;
    cashBackPercentage?:                number;
    helpPercentage?:                    number;
    drawingPercentage?:                 number;
    communityPercentage?:               number;
    pointsPercentage?:                  number;
    username?:                          string;
    homeDelivery?:                      boolean;
    rangeService?:                      number;
    onlineService?:                     boolean;
    createdAt?:                         Date;
    updatedAt?:                         Date;
    socialCommunityOficialPreferences?: null;
    socialCommunityUserPreferences?:    null;
    seats?:                             Seat[];
}

export interface Seat {
    id?:                  string;
    name?:                string;
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
    pin?:                 string;
    clientsType?:         ClientsType[];
    categories?:          Category[];
    prog?:                number;
    isVisible?:           boolean;
    schedule?:            SeatSchedule[];
    walletId?:            string;
    isSuggested?:         boolean;
    createdAt?:           Date;
    updatedAt?:           Date;
    country?:             Country;
    type?:                SeatType;
}

export interface Category {
    id?:                         string;
    status?:                     boolean;
    children?:                   Category[];
    parentId?:                   string;
    createdAt?:                  null;
    updatedAt?:                  Date | null;
    description?:                string;
    isProfessional?:             boolean;
    minimumPercentage?:          number;
    suggestedPercentage?:        number;
    companyCategoryTranslation?: CompanyTypeTranslation;
}

export interface CompanyTypeTranslation {
    id?:           string;
    description?:  string;
    languageCode?: string;
    relation?:     string;
}

export interface ClientsType {
    id?:                               string;
    description?:                      string;
    companySeatClientTypeTranslation?: CompanyTypeTranslation[];
}

export interface SeatSchedule {
    isOpen?:    boolean;
    schedule?:  ScheduleSchedule[];
    dayOfWeek?: CompanyTypeTranslation;
}

export interface ScheduleSchedule {
    end?:       string;
    start?:     string;
    hourEnd?:   string[];
    hourStart?: string[];
}

export interface SeatType {
    id?:                         string;
    description?:                string;
    companySeatTypeTranslation?: CompanyTypeTranslation[];
}

export interface DatumType {
    id?:                     string;
    description?:            string;
    createdAt?:              Date;
    updatedAt?:              Date;
    companyTypeTranslation?: CompanyTypeTranslation[];
}

export interface Metadata {
    page?:     number;
    total?:    number;
    lastPage?: number;
}
