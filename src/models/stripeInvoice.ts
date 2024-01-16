export type StripeInvoice = {
  id: string;
  account_name: string;
  amount_due: number;
  amount_paid: number;
  customer: string;
  customer_address: null;
  customer_email: string;
  customer_name: string;
  period_end: number;
  period_start: number;
  hosted_invoice_url: string;
  invoice_pdf: string;
  subscription: string;
  description: string;
};
