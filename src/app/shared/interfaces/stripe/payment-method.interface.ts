export interface PaymentMethod {
  object: string;
  data: Datum[];
  has_more: boolean;
  url: string;
}

interface Datum {
  id: string;
  object: string;
  allow_redisplay: string;
  billing_details: Billingdetails;
  card: Card;
  created: number;
  customer: string;
  livemode: boolean;
  metadata: Metadata;
  radar_options: Metadata;
  type: string;
}

interface Metadata {}

interface Card {
  brand: string;
  checks: Checks;
  country: string;
  display_brand: string;
  exp_month: number;
  exp_year: number;
  fingerprint: string;
  funding: string;
  generated_from: null;
  last4: string;
  networks: Networks;
  three_d_secure_usage: Threedsecureusage;
  wallet: null;
}

interface Threedsecureusage {
  supported: boolean;
}

interface Networks {
  available: string[];
  preferred: null;
}

interface Checks {
  address_line1_check: null;
  address_postal_code_check: null;
  cvc_check: string;
}

interface Billingdetails {
  address: Address;
  email: string;
  name: string;
  phone: string;
}

interface Address {
  city: null;
  country: null;
  line1: null;
  line2: null;
  postal_code: null;
  state: null;
}
