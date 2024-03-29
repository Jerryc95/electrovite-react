export type StripeSubscription = {
  id: string;
  customer: string;
  start_date: number;
  current_period_end: number;
  current_period_start: number;
  trial_end: number;
  cancel_at: number | null;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  status: string;
  default_payment_method: string | null;
};
