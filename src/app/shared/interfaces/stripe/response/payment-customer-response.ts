export interface PaymentCustomerResponse {
  id: string;
  object: string;
  amount: number;
  amount_capturable: number;
  amount_details: Amountdetails;
  amount_received: number;
  application: null;
  application_fee_amount: null;
  automatic_payment_methods: Automaticpaymentmethods;
  canceled_at: null;
  cancellation_reason: null;
  capture_method: string;
  client_secret: string;
  confirmation_method: string;
  created: number;
  currency: string;
  customer: string;
  description: null;
  invoice: null;
  last_payment_error: null;
  latest_charge: null;
  livemode: boolean;
  metadata: Tip;
  next_action: null;
  on_behalf_of: null;
  payment_method: string;
  payment_method_configuration_details: null;
  payment_method_options: Paymentmethodoptions;
  payment_method_types: string[];
  processing: null;
  receipt_email: null;
  review: null;
  setup_future_usage: null;
  shipping: null;
  source: null;
  statement_descriptor: null;
  statement_descriptor_suffix: null;
  status: string;
  transfer_data: null;
  transfer_group: null;
}

interface Paymentmethodoptions {
  card: Card;
}

interface Card {
  installments: null;
  mandate_options: null;
  network: null;
  request_three_d_secure: string;
}

interface Automaticpaymentmethods {
  allow_redirects: string;
  enabled: boolean;
}

interface Amountdetails {
  tip: Tip;
}

interface Tip {}
