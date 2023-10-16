export type Project = {
  id: number;
  account_id: number;
  name: string;
  description: string;
  notes: string;
  creationDate: Date;
  startDate: Date;
  dueDate: Date;
  status: string;
  completed: boolean;
};
