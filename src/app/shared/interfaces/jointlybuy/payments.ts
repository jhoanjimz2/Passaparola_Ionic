export interface RequestTransactionWillbuy {
    observation?:         string;
    status?:              boolean;
    amount?:              number;
    quantity?:            number;
    walletTransactionId?: string;
    product?:             ID;
    willbuy?:             ID;
    address?:             ID;
}

export interface ID {
    id?: string;
}
