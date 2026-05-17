export interface RechargeInGateway {
  amount: number;
  description: string;
  idStripe: string;
  payment_method: string;
  walletCode: string;
}
