export interface IResponseBankCard {
  data: IBankCard[];
  metadata: {
    page: number;
    total: number;
    lastPage: number;
  };
}

export interface IBankCard {
  id?: string;
  idStripe: string;
}
