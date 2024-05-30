import { StripeSubscription } from './stripeSubscription';
import { Subscription } from './subscription';

export type SubscriptionInfo = {
  account_id: number;
  subscription: Subscription;
  stripeSubscription: StripeSubscription;
  previousSubscription: Subscription;
};
