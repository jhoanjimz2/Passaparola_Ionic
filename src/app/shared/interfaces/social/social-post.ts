export interface FindAllUserParams {
  limit?: number;
  offset?: number;
  keyword?: string;
  languageCode?: string;
  seatId?: string;
}

export interface SocialPostByUser {
    data?:     SocialTag[];
    metadata?: Metadata;
    seatInfo?: Seat;
}

export interface SocialTag {
    id?:               string;
    title?:            string;
    description?:      string;
    urlFile?:          string;
    typeFile?:         string;
    products?:         any[];
    productsData?:     any[];
    status?:           boolean;
    topics?:           any[];
    categoryTopics?:   any[];
    userIds?:          any[];
    users?:            any[];
    verifiedProducts?: any[];
    createdAt?:        Date;
    updatedAt?:        Date;
    user?:             { profile?: UserProfile, id?: string };
    company?:          Company;
    likes?:            LikeStatus[];
    views?:            any[];
    saves?:            any[];
    shares?:           any[];
    seat?:             Seat;
    store?:            { id?: string } | null;
    event?:            { id?: string } | null;
    project?:            { id?: string } | null;
}

export interface Product {
  name:              string;
  pr:                number;
  description:       string;
  price:             number;
  isFree:            boolean;
  quantity:          number;
  quantityOffer:     number;
  offerValue:        number;
  discount:          number;
  offerPrice:        number;
  pictureUlrFile:    string;
  id?: string;
}
export interface LikeStatus {
  id: string;
  status: boolean;
  seat: Seat;
  user: {
    id: string
  }
}
export interface SeatInfoProfile {
    id?:                        string;
    name?:                      string;
    legalRepresentative?:       string;
    legalAddress?:              string;
    legalLatitude?:             string;
    legalLongitude?:            string;
    profilePictureUrlFile?:     string;
    status?:                    boolean;
    legalRepresentativeFiscal?: string;
    iva?:                       string;
    rewardPercentage?:          number;
    cashBackPercentage?:        number;
    helpPercentage?:            number;
    drawingPercentage?:         number;
    communityPercentage?:       number;
    pointsPercentage?:          number;
    username?:                  string;
    homeDelivery?:              boolean;
    rangeService?:              number;
    onlineService?:             boolean;
    createdAt?:                 Date;
    updatedAt?:                 Date;
    company?:                   Company;
    seats?:                     Seat[];
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
    tags?:                string[] | null;
    rewardPercentage?:    number;
    cashBackPercentage?:  number;
    helpPercentage?:      number;
    drawingPercentage?:   number;
    communityPercentage?: number;
    pointsPercentage?:    number;
    phone?:               string;
    pin?:                 string;
    clientsType?:         ClientsType[];
    categories?:          Category[] | null;
    prog?:                number;
    isVisible?:           boolean;
    schedule?:            SeatInfoSchedule[];
    walletId?:            string;
    isSuggested?:         boolean;
    createdAt?:           Date;
    updatedAt?:           Date;
    country?:             Country;
    type?:                SeatInfoType;
    profile?:             SeatInfoProfile;
}

export interface CompanyProfile {
    id?:                        string;
    name?:                      string;
    legalRepresentative?:       string;
    legalAddress?:              string;
    legalLatitude?:             string;
    legalLongitude?:            string;
    profilePictureUrlFile?:     string;
    status?:                    boolean;
    legalRepresentativeFiscal?: string;
    iva?:                       string;
    rewardPercentage?:          number;
    cashBackPercentage?:        number;
    helpPercentage?:            number;
    drawingPercentage?:         number;
    communityPercentage?:       number;
    pointsPercentage?:          number;
    username?:                  string;
    homeDelivery?:              boolean;
    rangeService?:              number;
    onlineService?:             boolean;
    createdAt?:                 Date;
    updatedAt?:                 Date;
    seats?:                     Seat[];
}

export interface Company {
    id?:                     string;
    prog?:                   number;
    email?:                  string;
    phoneNumber?:            string;
    userID?:                 string;
    pin?:                    string;
    status?:                 boolean;
    pinActive?:              boolean;
    promoCode?:              string;
    countryCode?:            string;
    rol?:                    string;
    emails?:                 string[];
    phones?:                 string[];
    freeNotification?:       boolean;
    freeEmailNotificaction?: boolean;
    phoneNotificaction?:     boolean;
    transactionBlocker?:     boolean;
    createdAt?:              Date;
    updatedAt?:              Date;
    country?:                Country;
    type?:                   LegalTypeClass;
    profile?:                CompanyProfile;
    companyPassword?:        CompanyPassword[];
    legalType?:              LegalTypeClass;
    events?:                 Event[];
    products?:               any[];
}

export interface Category {
    id?:                         string;
    status?:                     boolean;
    children?:                   Category[];
    parentId?:                   string;
    createdAt?:                  null;
    updatedAt?:                  null;
    description?:                string;
    isProfessional?:             boolean;
    minimumPercentage?:          number;
    suggestedPercentage?:        number;
    companyCategoryTranslation?: DayOfWeek;
}

export interface DayOfWeek {
    id?:           string;
    description?:  string;
    languageCode?: string;
    relation?:     string;
}
export interface ClientsType {
    id?:                               string;
    description?:                      string;
    companySeatClientTypeTranslation?: DayOfWeek[];
}

export interface Country {
    id?:           string;
    code?:         string;
    phonePrefix?:  string;
    name?:         string;
    languageCode?: string;
}

export interface SeatInfoSchedule {
    isOpen?:    boolean;
    schedule?:  ScheduleSchedule[];
    dayOfWeek?: DayOfWeek;
}

export interface ScheduleSchedule {
    end?:       string;
    start?:     string;
    hourEnd?:   string[];
    hourStart?: string[];
}

export interface SeatInfoType {
    id?:                         string;
    description?:                string;
    companySeatTypeTranslation?: DayOfWeek[];
}

export interface CompanyPassword {
    id?:        string;
    pin?:       string;
    status?:    boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Event {
    id?:                string;
    name?:              string;
    description?:       string;
    webAddress?:        string;
    address?:           string;
    latitude?:          string;
    longitude?:         string;
    countryCode?:       string;
    pictureUlrFile?:    string;
    coverUrlFile?:      string;
    pictureGallery?:    null;
    tags?:              null;
    ticketsFrom?:       number;
    availability?:      number;
    schedule?:          null;
    dateFrom?:          null;
    dateTo?:            null;
    status?:            boolean;
    isGreen?:           boolean;
    greenDescription?:  string;
    processStatus?:     string;
    createdAt?:         Date;
    updatedAt?:         Date;
    categories?:        null;
    country?:           Country;
    rules?:             any[];
    products?:          any[];
    tickets?:           any[];
    statusTranactions?: any[];
}

export interface LegalTypeClass {
    id?:                          string;
    description?:                 string;
    createdAt?:                   Date;
    updatedAt?:                   Date;
    companyLegalTypeTranslation?: DayOfWeek[];
    companyTypeTranslation?:      DayOfWeek[];
}

export interface Metadata {
    page?:     string;
    total?:    number;
    lastPage?: number;
}
export interface UserProfile {
  countryResidence: string | null;
  createdAt: string; // formato ISO 8601
  dateBirth: string | null; // podría ser string o Date
  homeAddress: string;
  homeCountry: string | null;
  id: string;
  idCardUrlFile: string;
  idCardVerified: boolean;
  lastName: string;
  name: string;
  profilePictureUrlFile: string;
  proofResidencyUrlFile: string;
  proofResidencyVerified: boolean;
  residenceAddress: string;
  status: boolean;
  taxNumber: string;
  updatedAt: string; // formato ISO 8601
  username: string;
}
