export type Project = {
  id: number;
  account_id: number;
  name: string;
  description: string;
  notes: string;
  creation_date: Date;
  start_date: Date;
  end_date: Date;
  status: string;
  completed: Date;
};
