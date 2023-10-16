import { ContactEvent } from './contactEvent';

export type Contact = {
  id: number;
  account_id: number;
  creation_date: Date;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  company: string | null;
  role: string | null;
  last_contact_date: Date | null;
  next_contact_date: Date | null;
  contact_status: string;
  proposal_status: string;
  contract_status: string;
  notes: string | null;
  industry: string | null;
  events: ContactEvent[];
  birthday: Date | null;
  website: string | null;
  social: string | null;
};
