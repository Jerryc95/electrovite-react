export type Subscription = {
  id: number;
  name: string;
  description: string;
  price: number;
  billing_cycle: string;
  features: string[];
  stripe_price_id: string;
};
