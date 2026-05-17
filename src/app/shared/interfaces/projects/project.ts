export interface ResponseProject {
    data:     Project[];
    metadata: Metadata;
}

export interface Project {
    id?:                    string;
    walletId?:              string;
    type?:                  string;
    name?:                  string;
    logo?:                  string;
    status?:                string;
    initial?:               string;
    price?:                 number;
    amount?:                number;
    totalValue?:            number;
    tokensAvailable?:       number;
    dateStart?:             Date;
    dateEnd?:               Date;
    refundFund?:            number;
    passaparolaPercentage?: number;
    antereumPercentage?:    number;
    image?:                 string;
    email?:                 string;
    urlWeb?:                string;
    urlFacebok?:            string;
    urlInstagram?:          string;
    urlYoutube?:            string;
    urlTiktok?:             string;
    urlUnika?:              string;
    address?:               string;
    isGreen?:               boolean;
    metadataCountry?:       MetadataCountry[];
    numberStages?:          number;
    metadataStages?:        MetadataStage[];
    latitude?:              string;
    longitude?:             string;
    createdAt?:             Date;
    updatedAt?:             Date;
    category?:              Category;
    country?:               Country;
    sharePercentage?:       number;
    monthlyBilling?: number;
    shared?: number;
    tokenEur?: number;
    yourToken?: number;
    yourEarning?: number;
    tokensSold?: number;
}

export interface Category {
    id:                         string;
    name:                       string;
    createdAt:                  null;
    updatedAt:                  null;
    projectCategoryTranslation: CategoryTranslation[];
    categoryTranslation:        CategoryTranslation[];
}

export interface CategoryTranslation {
    id:           string;
    description:  string;
    languageCode: string;
}

export interface Country {
    id:           string;
    code:         string;
    phonePrefix:  string;
    name:         string;
    languageCode: string;
}

export interface MetadataCountry {
    country:          string;
    contractUrl:      string;
    description:      string;
    documentUrl:      string;
    longDescription:  string;
    otherDocumentUrl: string;
}

export interface MetadataStage {
    index:           number;
    endDate:         Date;
    startDate:       Date;
    tokenPrice:      number;
    bonusMonths:     number;
    bonusPercent:    number;
    minimumPurchase: number;
    availableTokens: number;
    referralPercent: number;
    sharedPercent?:  number;
}

export interface Metadata {
    page:     number;
    total:    number;
    lastPage: number;
}
