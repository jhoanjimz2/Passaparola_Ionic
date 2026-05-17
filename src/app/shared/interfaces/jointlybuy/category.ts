export interface CategoryWillbuy {
    id?:                         string;
    imageUrl?:                   string;
    urlImage?:                   string;
    description?:                string;
    parentId?:                   null | string;
    status?:                     boolean;
    suggestedPercentage?:        number;
    minimumPercentage?:          number;
    createdAt?:                  Date;
    updatedAt?:                  Date;
    productCategoryTranslation?: ProductCategoryTranslation[];
    children?:                   CategoryWillbuy[];
}

export interface ProductCategoryTranslation {
    id?:           string;
    description?:  string;
    languageCode?: string;
}
