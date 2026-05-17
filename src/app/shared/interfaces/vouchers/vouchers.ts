

export interface Voucher {
  id?:             string;
  name?:           string;
  pr?:             number;
  description?:    string;
  isFree?:         boolean;
  isActive?:       boolean;
  status?:         boolean;
  pictureUlrFile?: string;
  quantity?:       number;
  price?:          number;
  quantityOffer?:  number;
  offerValue?:     number;
  discount?:       number;
  offerPrice?:     number;
  cashBack?:       number;
  purchaseDate?:   Date;
  dateTo?:         Date;
  company?: {
    profile: {
      name: string;
      legalAddress: string;
    }
  }
}
