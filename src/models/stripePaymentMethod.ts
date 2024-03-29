export type StripePaymentMethod = {
  id: string;
  card: string;
  expirationMonth: number;
  expirationYear: number;
  lastFour: string;
  address: StripeAddress;
};

export type StripeAddress = {
  city: string;
  country: string;
  line1: string;
  line2: string;
  postal_code: string;
  state: string;
};
