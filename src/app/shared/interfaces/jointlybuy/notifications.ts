export enum NotificationType {
  all = 'all',
  willbuyInvestes = 'willbuy',
  willbuyManaged  = 'willbuyManaged',
  payment         = 'payment',
  wishbuy         = 'wishbuy',
  willbuy         = 'willbuy',
}

export enum WishbuyWillbuyNotificationType {
  all = 'all',
  newNotification = 'newNotification',
  completed       = 'completed',
  expired         = 'expired',
  newPrice        = 'newPrice',
  newUser         = 'newUser',
  rejected        = 'rejected',
  newState        = 'newState'
}


export interface Notification {
    id?:                             string;
    userId?:                         string;
    title?:                          string;
    description?:                    string;
    payload?:                        Payload;
    status?:                         boolean;
    isRead?:                         boolean;
    languageCode?:                   string;
    createdAt?:                      Date;
    updatedAt?:                      Date;
    type?:                           NotificationType;
    wishbuyWillbuyNotificationType?: WishbuyWillbuyNotificationType;
}
export interface Payload {
    willbuy?:              Willbuy;
    savedTransaction?:     SavedTransaction;
    id?:                   string;
    tax?:                  number;
    days?:                 number;
    user?:                 User;
    buyIn?:                string;
    buyer?:                boolean;
    extra?:                number;
    joyer?:                boolean;
    link1?:                string;
    link2?:                string;
    link3?:                string;
    price?:                number;
    total?:                number;
    buyEnd?:               string;
    status?:               string;
    carrier?:              number;
    country?:              string;
    deposit?:              number;
    product?:              PayloadProduct;
    isActive?:             boolean;
    quantity?:             number;
    createdAt?:            Date;
    isWillbuy?:            boolean;
    platforms?:            string;
    purchased?:            number;
    updatedAt?:            Date;
    dateResult?:           Date;
    link1Price?:           number;
    link2Price?:           number;
    link3Price?:           number;
    commissions?:          number;
    observation?:          string;
    productLink?:          string;
    homeDelivery?:         string;
    link1Savings?:         number;
    link2Savings?:         number;
    link3Savings?:         number;
    shippingType?:         string;
    externalPrice?:        number;
    shippingPrice?:        number;
    nationalArrival?:      string;
    purchaseDiscounts?:    PurchaseDiscount[];
    jointlyBuyPercentage?: number;
}

export interface PayloadProduct {
    id?:                      string;
    pr?:                      number;
    iva?:                     number;
    name?:                    string;
    tags?:                    string[];
    type?:                    string;
    price?:                   number;
    isFree?:                  boolean;
    paspot?:                  number;
    status?:                  boolean;
    cashBack?:                number;
    earnings?:                number;
    recharge?:                number;
    createdAt?:               Date;
    updatedAt?:               Date;
    jointlyBuy?:              boolean;
    variations?:              Variation[];
    codeCountry?:             string;
    description?:             null;
    freeShipping?:            boolean;
    priceWithIva?:            number;
    sellingPrice?:            number;
    fromDashboard?:           boolean;
    purchasePrice?:           number;
    saleDiscounts?:           SaleDiscount[];
    pictureGallery?:          null;
    pictureUrlFile?:          string;
    longDescription?:         null;
    quantityInOffer?:         number;
    freeShippingPrice?:       number;
    packageDimensions?:       PackageDimensions;
    productDimensions?:       ProductDimensions;
    minimumOrderQuantity?:    number;
    discountsForPurchases?:   PurpleDiscountsForPurchase[];
    minimumPurchaseOfUnits?:  number;
    reorganizationDeadlines?: number;
}

export interface PurpleDiscountsForPurchase {
    price?:    number;
    quantity?: number;
}

export interface PackageDimensions {
    stock?:  number;
    width?:  number;
    height?: number;
    length?: number;
    weight?: number;
}

export interface ProductDimensions {
    EAN?:    string;
    SKU?:    string;
    width?:  number;
    height?: number;
    length?: number;
    weight?: number;
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
    quantity?:             number;
    priceWithIva?:         number;
    totalWillbuy?:         string;
    priceShipping?:        number;
    minimumPurchaseUnits?: number;
}

export interface SavedTransaction {
    id?:                  string;
    user?:                User;
    amount?:              number;
    status?:              boolean;
    address?:             WillbuyClass;
    product?:             SavedTransactionProduct;
    willbuy?:             WillbuyClass;
    quantity?:            number;
    createdAt?:           Date;
    updatedAt?:           Date;
    observation?:         string;
    walletTransactionId?: string;
}

export interface WillbuyClass {
    id?: string;
}

export interface SavedTransactionProduct {
    id?:                      string;
    pr?:                      number;
    iva?:                     number;
    name?:                    string;
    tags?:                    string[];
    type?:                    string;
    price?:                   number;
    isFree?:                  boolean;
    paspot?:                  number;
    status?:                  boolean;
    cashBack?:                number;
    earnings?:                number;
    recharge?:                number;
    createdAt?:               Date;
    updatedAt?:               Date;
    jointlyBuy?:              boolean;
    variations?:              Variation[];
    codeCountry?:             string;
    description?:             null;
    freeShipping?:            boolean;
    priceWithIva?:            number;
    sellingPrice?:            number;
    fromDashboard?:           boolean;
    purchasePrice?:           number;
    saleDiscounts?:           SaleDiscount[];
    pictureGallery?:          string[];
    pictureUrlFile?:          string;
    longDescription?:         null;
    quantityInOffer?:         number;
    freeShippingPrice?:       number;
    packageDimensions?:       PackageDimensions;
    productDimensions?:       ProductDimensions;
    minimumOrderQuantity?:    number;
    discountsForPurchases?:   FluffyDiscountsForPurchase[];
    minimumPurchaseOfUnits?:  number;
    reorganizationDeadlines?: number;
    brand?:                   InternationalShippingAgent;
    category?:                Category;
    categories?:              Category[];
    shippingAgent?:           InternationalShippingAgent;
    transferPercentages?:     TransferPercentages;
}

export interface InternationalShippingAgent {
    id?:          string;
    dry?:         boolean;
    logo?:        string;
    name?:        string;
    email?:       string;
    cooled?:      boolean;
    status?:      boolean;
    address?:     string;
    webSite?:     string;
    negative?:    boolean;
    createdAt?:   Date;
    reference?:   string;
    updatedAt?:   Date;
    description?: string;
    phoneNumber?: string;
}

export interface Category {
    id?:                  string;
    status?:              boolean;
    parentId?:            null | string;
    urlImage?:            null | string;
    createdAt?:           Date;
    updatedAt?:           Date;
    description?:         string;
    minimumPercentage?:   number;
    suggestedPercentage?: number;
}

export interface FluffyDiscountsForPurchase {
    iva?:                  number;
    quantity?:             number;
    priceWithIva?:         number;
    purchasePrice?:        number;
    minimumPurchaseUnits?: number;
}

export interface TransferPercentages {
    helpPercentage?:      number;
    pointsPercentage?:    number;
    rewardPercentage?:    number;
    drawingPercentage?:   number;
    cashBackPercentage?:  number;
    communityPercentage?: number;
}

export interface User {
    id?:                     string;
    pin?:                    string;
    rol?:                    string;
    prog?:                   number;
    email?:                  string;
    emails?:                 null;
    phones?:                 null;
    status?:                 boolean;
    userID?:                 string;
    country?:                CountryClass;
    profile?:                Profile;
    createdAt?:              Date;
    pinActive?:              boolean;
    promoCode?:              string;
    updatedAt?:              Date;
    levelRange?:             number;
    countryCode?:            string;
    phoneNumber?:            string;
    userPassword?:           UserPassword[];
    dashboardUser?:          boolean;
    userApplication?:        UserApplication[];
    freeNotification?:       boolean;
    phoneNotificaction?:     boolean;
    transactionBlocker?:     boolean;
    freeEmailNotificaction?: boolean;
}

export interface CountryClass {
    id?:           string;
    code?:         string;
    name?:         string;
    phonePrefix?:  string;
    languageCode?: string;
}
export interface Profile {
    id?:                                string;
    name?:                              string;
    status?:                            boolean;
    lastName?:                          string;
    username?:                          string;
    addresses?:                         AddressElement[];
    createdAt?:                         Date;
    dateBirth?:                         Date | null;
    taxNumber?:                         string;
    updatedAt?:                         Date;
    homeAddress?:                       string;
    homeCountry?:                       CountryClass | null;
    idCardUrlFile?:                     string;
    idCardVerified?:                    boolean;
    countryResidence?:                  CountryClass | null;
    residenceAddress?:                  string;
    profilePictureUrlFile?:             string;
    proofResidencyUrlFile?:             string;
    proofResidencyVerified?:            boolean;
    socialCommunityUserPreferences?:    SocialCommunityUserPreference[];
    socialCommunityOficialPreferences?: SocialCommunityOficialPreference[] | SocialCommunityOficialPreferencesClass;
}

export interface AddressElement {
    id?:                   string;
    CAP?:                  string;
    nro?:                  string;
    name?:                 string;
    status?:               boolean;
    address?:              string;
    country?:              CountryClass;
    provice?:              string;
    latitude?:             string;
    locality?:             string;
    nickname?:             string;
    createdAt?:            Date;
    longitude?:            string;
    updatedAt?:            Date;
    phoneNumber?:          string;
    defaultAddress?:       boolean;
    deliveryInstructions?: string;
}

export interface SocialCommunityOficialPreference {
    id?:   string;
    type?: string;
}

export interface SocialCommunityOficialPreferencesClass {
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
export interface Willbuy {
    id?:                         string;
    tax?:                        number;
    days?:                       number;
    user?:                       User;
    buyIn?:                      Date;
    buyer?:                      boolean;
    extra?:                      number;
    joyer?:                      boolean;
    link1?:                      string;
    link2?:                      string;
    link3?:                      string;
    price?:                      number;
    total?:                      number;
    buyEnd?:                     Date;
    status?:                     string;
    carrier?:                    number;
    company?:                    null;
    country?:                    string;
    deposit?:                    number;
    product?:                    SavedTransactionProduct;
    isActive?:                   boolean;
    quantity?:                   number;
    createdAt?:                  Date;
    isWillbuy?:                  boolean;
    platforms?:                  string;
    purchased?:                  number;
    updatedAt?:                  Date;
    dateResult?:                 null;
    link1Price?:                 number;
    link2Price?:                 number;
    link3Price?:                 number;
    commissions?:                number;
    observation?:                string;
    productLink?:                string;
    homeDelivery?:               Date;
    link1Savings?:               number;
    link2Savings?:               number;
    link3Savings?:               number;
    shippingType?:               string;
    willbuyViews?:               UserPassword[];
    externalPrice?:              number;
    shippingPrice?:              number;
    nationalArrival?:            Date;
    purchaseDiscounts?:          PurchaseDiscount[];
    willbuyTransactions?:        WillbuyTransaction[];
    jointlyBuyPercentage?:       number;
    nationalShippingAgent?:      InternationalShippingAgent;
    internationalShippingAgent?: InternationalShippingAgent;
}

export interface WillbuyTransaction {
    id?:                  string;
    user?:                User;
    amount?:              number;
    status?:              boolean;
    quantity?:            number;
    createdAt?:           Date;
    updatedAt?:           Date;
    observation?:         string;
    walletTransactionId?: string;
}
