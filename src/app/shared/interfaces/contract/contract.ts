export interface Contract {
  status: boolean;
  schedule: string;
  firstAndLastName: string;
  address: string;
  streetNumber: string;
  city: string;
  province: string;
  cap: string;
  dateOfBirth: string;
  cityOfBirth: string;
  province2: string;
  gender: string;
  taxId: string;
  phoneNumber: string;
  email: string;
  supplyStreet: string;
  supplyNumber: string;
  supplyCity: string;
  supplyPr: string;
  supplyCap: string;
  supplyPdrPod: string;
  currentPower: number;
  powerRequired: number;
  currentSupplier: string;
  voltage: string;
  activationDate: string;
  immediateActivation: false;
  urlFrontIdDoc: string;
  urlBackIdDoc: string;
  urlTaxIdDoc: string;
  lastBill: string;
  place: string;
  registrationDate: string;
  country: {
    id: string;
  };
}
