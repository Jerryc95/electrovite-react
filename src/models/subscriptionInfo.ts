import { StripeSubscription } from './stripeSubscription';
import { Subscription } from './subscription';

export type SubscriptionInfo = {
  account_id: number;
//   subscription_id: number;
  subscription: Subscription;
  stripeSubscription: StripeSubscription;

//   account_id: number;
//   billing_cycle: string;
//   customer_id: string;
//   description: string;
//   features: string[];
//   id: number;
//   name: string;
//   price: string;
//   renewal_date: null;
//   stripe_price_id: string | null;
//   stripe_sub_id: string | null;
//   subscription_end_date: number | null;
//   subscription_id: number;
//   subscription_start_date: string;
//   status: string;
};