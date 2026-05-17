export interface SocialSummary {
    myPublications?:      number;
    following?:           number;
    followers?:           number;
    mutualFollowing?:     number;
    totalViewsOnMyPosts?: number;
    totalLikesOnMyPosts?: number;
    targetInfo?:          TargetInfo;
    userInfo?:            UserInfo;
}

export interface TargetInfo {
    type?:     string;
    entity?:   UserInfo;
    seatInfo?: Seat;
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
    countryCode?:         Code;
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
    clientsType?:         ClientsType[];
    categories?:          Category[] | null;
    prog?:                number;
    isVisible?:           boolean;
    schedule?:            SeatInfoSchedule[];
    walletId?:            string;
    isSuggested?:         boolean;
    createdAt?:           Date;
    updatedAt?:           Date;
    profile?:             Profile;
    country?:             Country;
    type?:                SeatInfoType;
    pin?:                 string;
}

export interface Profile {
    id?:                        string;
    name?:                      string;
    lastName?:                  string;
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
    company?:                   UserInfo;
    seats?:                     Seat[];
}

export interface UserInfo {
    id?:                     string;
    prog?:                   number;
    email?:                  string;
    phoneNumber?:            string;
    userID?:                 string;
    pin?:                    string;
    status?:                 boolean;
    pinActive?:              boolean;
    promoCode?:              string;
    countryCode?:            Code;
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
    profile?:                Profile;
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
    description?:                Description;
    isProfessional?:             boolean;
    minimumPercentage?:          number;
    suggestedPercentage?:        number;
    companyCategoryTranslation?: DayOfWeek;
}

export interface DayOfWeek {
    id?:           string;
    description?:  string;
    languageCode?: LanguageCode;
    relation?:     string;
}

export enum LanguageCode {
    It = "IT",
}

export enum Description {
    Hardware = "Hardware",
    SoftwareDevelopment = "software development",
    TecnologiaEInformatica = "Tecnologia e Informatica",
}

export interface ClientsType {
    id?:                               string;
    description?:                      string;
    companySeatClientTypeTranslation?: DayOfWeek[];
}

export interface Country {
    id?:           string;
    code?:         Code;
    phonePrefix?:  string;
    name?:         string;
    languageCode?: LanguageCode;
}

export enum Code {
    Es = "ES",
}

export interface SeatInfoSchedule {
    isOpen?:    boolean;
    schedule?:  ScheduleSchedule[];
    dayOfWeek?: DayOfWeek;
}

export interface ScheduleSchedule {
    end?:       End;
    start?:     Start;
    hourEnd?:   End[];
    hourStart?: Start[];
}

export enum End {
    The1000 = "10:00",
    The1100 = "11:00",
    The1200 = "12:00",
    The1300 = "13:00",
    The1400 = "14:00",
    The1500 = "15:00",
    The1600 = "16:00",
    The1700 = "17:00",
    The1800 = "18:00",
    The1900 = "19:00",
    The2000 = "20:00",
    The2100 = "21:00",
    The2200 = "22:00",
    The2300 = "23:00",
}

export enum Start {
    The0000 = "00:00",
    The0100 = "01:00",
    The0200 = "02:00",
    The0300 = "03:00",
    The0400 = "04:00",
    The0500 = "05:00",
    The0600 = "06:00",
    The0700 = "07:00",
    The0800 = "08:00",
    The0900 = "09:00",
    The1000 = "10:00",
    The1100 = "11:00",
    The1200 = "12:00",
    The1300 = "13:00",
    The1400 = "14:00",
    The1500 = "15:00",
    The1600 = "16:00",
    The1700 = "17:00",
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
    id?:               string;
    name?:             string;
    description?:      string;
    webAddress?:       string;
    address?:          string;
    latitude?:         string;
    longitude?:        string;
    countryCode?:      Code;
    pictureUlrFile?:   string;
    coverUrlFile?:     string;
    pictureGallery?:   null;
    tags?:             null;
    ticketsFrom?:      number;
    availability?:     number;
    schedule?:         null;
    dateFrom?:         null;
    dateTo?:           null;
    status?:           boolean;
    isGreen?:          boolean;
    greenDescription?: string;
    processStatus?:    ProcessStatus;
    createdAt?:        Date;
    updatedAt?:        Date;
    categories?:       null;
}

export enum ProcessStatus {
    Inactive = "inactive",
}

export interface LegalTypeClass {
    id?:          string;
    description?: string;
    createdAt?:   Date;
    updatedAt?:   Date;
}
