export interface BroadcastMessage {
  userId: string;
  type:
    | 'notification'
    | 'recharge'
    | 'cashPayment'
    | 'payment'
    | 'cancelPayment';
  payload?: any;
}
