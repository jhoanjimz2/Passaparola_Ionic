export interface CreatePaymentIntent {
  amount: number;
  currency: string;
  customerId: string;
  paymentMethod: string;
}
