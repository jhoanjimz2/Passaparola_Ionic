export interface CreateAddressRequest {
  nickname: string;
  name: string;
  phoneNumber: string;
  address: string;
  latitude: string;
  longitude: string;
  nro: string;
  locality: string;
  provice: string;
  CAP: string;
  deliveryInstructions: string;
  status: boolean;
  defaultAddress: boolean;
  country: {
    id: string;
  };
}


export interface Address {
  id?:                   string;
  nickname?:             string;
  name?:                 string;
  phoneNumber?:          string;
  address?:              string;
  latitude?:             string;
  longitude?:            string;
  nro?:                  string;
  locality?:             string;
  provice?:              string;
  CAP?:                  string;
  deliveryInstructions?: string;
  status?:               boolean;
  defaultAddress?:       boolean;
  createdAt?:            Date;
  updatedAt?:            Date;
  country?:              Country;
}

export interface Country {
    id?:           string;
    code?:         string;
    phonePrefix?:  string;
    name?:         string;
    languageCode?: string;
}
