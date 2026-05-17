export interface Events {
  id?:               string;
  name?:             string;
  description?:      string;
  webAddress?:       string;
  address?:          string;
  processStatus?:     string;
  currencyStatus?:    string;
  latitude?:         string;
  longitude?:        string;
  countryCode?:      string;
  pictureUlrFile?:   string;
  coverUrlFile?:     string;
  pictureGallery?:   string[];
  rules?:            Rule[];
  tags?:             string[];
  ticketsFrom?:      number;
  availability?:     number;
  schedule?:         ScheduleEvent[];
  dateFrom?:         Date;
  dateTo?:           Date;
  status?:           boolean;
  createdAt?:        Date;
  updatedAt?:        Date;
  categories?:       CategoryEvent[];
  products?:         Product[]
  tickets?:          Ticket[]
  isGreen?:          boolean
  greenDescription?: string;
  eventStatus?:       StateEvent;
  digitalTickets?:   Ticket[];
  eventTicket?:      Ticket;
  productTickets?:   Ticket[];
  totalAmount?:      number;
  amountCollected?: number;
  company?: {
    countryCode: string;
    phoneNumber:string;
  }
}
export interface CategoryEvent {
  id:                       string;
  description:              string;
  parentId:                 string;
  status:                   boolean;
  createdAt:                null;
  updatedAt:                null;
  pictureUlrFile:           string;
  eventCategoryTranslation: EventCategoryTranslation;
  children:                 CategoryEvent[];
}

export interface EventCategoryTranslation {
  id:           string;
  description:  string;
  languageCode: string;
}
export interface EventTag {
  id:           string;
  description:  string;
  languageCode: string;
}
export interface ScheduleEvent {
  id?:       number;
  date:      string;
  hourStart: string;
  hourEnd:   string;
}
export interface Rule {
  id:        string;
  title:     string;
  items:     string[];
  status:    boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface SeatLocation {
  address: string;
  latitude: string;
  longitude: string;
  webAddress: string;
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
  event?:            Events;
  id?: string;
  quantityAvailable?: number;
  purchaseDate?: Date;
  eventTicket?: Ticket;
  eventProduct?: Product;
}
export interface Ticket {
  name:        string;
  pr:          number;
  description: string;
  price:       number;
  isFree:      boolean;
  isPreSale:   boolean;
  quantity:    number;
  event?:      Events;
  id?:         string;
  quantityAvailable?: number;
  purchaseDate?: Date;

  eventTicket?: Ticket;
  eventProduct?: Product;

  user?: any;
}

export interface StateEvent {
  id:                     string;
  description:            string;
  eventStatusTranslation: EventStatusTranslation[];
}

export interface EventStatusTranslation {
  id:           string;
  description:  string;
  languageCode: string;
}

export interface BuyTicket {
  id: string;
  walletFrom: string;
  quantity: number;
}














export interface EventStats {
  totalTickets:       string;
  totalTicketsSold:   string;
  totalUsedTickets:   string;
  totalAmountTickets: string;
  tickets:            ProductTicketStats[];
  products:           ProductTicketStats[];
}

export interface ProductTicketStats {
  name:               string;
  totalTickets:       string;
  totalTicketsSold:   string;
  totalUsedTickets:   string;
  totalAmountTickets: string;
}
