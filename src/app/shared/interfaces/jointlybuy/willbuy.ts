export interface RespWillbuy {
    data?:     Willbuy[];
    metadata?: Metadata;
}

export interface Willbuy {
    id?:                   string;
    productLink?:          string;
    link1?:                string;
    link2?:                string;
    link3?:                string;
    platforms?:            string;
    isActive?:             boolean;
    joyer?:                boolean;
    dateResult?:           null;
    buyer?:                boolean;
    price?:                number;
    externalPrice?:        number;
    purchased?:            number;
    observation?:          string;
    createdAt?:            Date;
    updatedAt?:            Date;
    status?:               string;
    buyIn?:                Date;
    buyEnd?:               Date;
    deposit?:              number;
    country?:              string;
    shippingType?:         string;
    days?:                 number;
    shippingPrice?:        number;
    quantity?:             number;
    tax?:                  number;
    carrier?:              number;
    extra?:                number;
    commissions?:          number;
    jointlyBuyPercentage?: number;
    total?:                number;
    link1Price?:           number;
    link1Savings?:         number;
    link2Price?:           number;
    link2Savings?:         number;
    link3Price?:           number;
    link3Savings?:         number;
    purchaseDiscounts?:    PurchaseDiscount[];
    isWillbuy?:            boolean;
    user?:                 User;
    company?:              null;
    product?:              Product;
    willbuyTransactions?:  WillbuyTransactions[]
}

export interface Product {
    id?:                      string;
    name?:                    string;
    description?:             string;
    longDescription?:         string;
    price?:                   number;
    codeCountry?:             string;
    status?:                  boolean;
    isFree?:                  boolean;
    pictureGallery?:          string[];
    pictureUrlFile?:          string;
    pr?:                      number;
    cashBack?:                number;
    pictureUlrFile?:          string;
    createdAt?:               Date;
    updatedAt?:               Date;
    tags?:                    string[];
    quantityInOffer?:         number;
    variations?:              Variation[];
    fromDashboard?:           boolean;
    type?:                    string;
    iva?:                     number;
    purchasePrice?:           number;
    priceWithIva?:            number;
    minimumPurchaseOfUnits?:  number;
    sellingPrice?:            number;
    earnings?:                number;
    minimumOrderQuantity?:    number;
    freeShipping?:            boolean;
    freeShippingPrice?:       number;
    paspot?:                  number;
    discountsForPurchases?:   DiscountsForPurchase[];
    saleDiscounts?:           SaleDiscount[];
    reorganizationDeadlines?: number;
    recharge?:                number;
    jointlyBuy?:              boolean;
    category?: {
      description?: string;
    };
    packageDimensions?: {
      width?: number;
      height?: number;
      length?: number;
      weight?: number;
    }
    productDimensions?: {
      width?: number;
      height?: number;
      length?: number;
      weight?: number;
    }
    transferPercentages: {
      rewardPercentage: number;
      cashBackPercentage: number;
      helpPercentage: number;
      drawingPercentage: number;
      communityPercentage: number;
      pointsPercentage: number;
    }
}

export interface DiscountsForPurchase {
    iva?:                  number;
    quantity?:             number;
    priceWithIva?:         number;
    purchasePrice?:        number;
    minimumPurchaseUnits?: number;
}

export interface SaleDiscount {
    price?:       number;
    profit?:      number;
    recharge?:    number;
    minimumSale?: number;
}

export interface Variation {
    id?:    string;
    name?:  string;
    value?: string[];
}

export interface PurchaseDiscount {
  total?:                string;
  priceWithIva?:         number;
  totalWillbuy?:         string;
  priceShipping?:        number;
  minimumPurchaseUnits?: number;
  quantity?:             number;
}

export interface User {
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
    emails?:                 null;
    phones?:                 null;
    freeNotification?:       boolean;
    freeEmailNotificaction?: boolean;
    phoneNotificaction?:     boolean;
    transactionBlocker?:     boolean;
    levelRange?:             number;
    createdAt?:              Date;
    updatedAt?:              Date;
    country?:                Country;
    userPassword?:           UserPassword[];
    userApplication?:        UserApplication[];
    profile?:                Profile;
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
    lastName?:                          string;
    username?:                          string;
    dateBirth?:                         Date;
    taxNumber?:                         string;
    residenceAddress?:                  string;
    homeAddress?:                       string;
    status?:                            boolean;
    idCardUrlFile?:                     string;
    proofResidencyUrlFile?:             string;
    idCardVerified?:                    boolean;
    proofResidencyVerified?:            boolean;
    profilePictureUrlFile?:             string;
    createdAt?:                         Date;
    updatedAt?:                         Date;
    socialCommunityOficialPreferences?: SocialCommunityOficialPreferences;
    socialCommunityUserPreferences?:    SocialCommunityUserPreference[];
}

export interface SocialCommunityOficialPreferences {
    id?:       string;
    prueba?:   SocialCommunityUserPreference[];
    username?: string;
}

export interface SocialCommunityUserPreference {
    id?:       string;
    username?: string;
}

export interface UserApplication {
    id?:        string;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

export interface UserPassword {
    id?:        string;
    pin?:       string;
    status?:    boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface WillbuyTransactions {
    quantity?: number;
}

export interface Metadata {
    page?:     number;
    total?:    number;
    lastPage?: number;
}
