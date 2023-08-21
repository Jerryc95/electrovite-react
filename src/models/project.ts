import { completionStatus } from '../enums/completionStatus';

export type Project = {
  projectID: string;
  userID: string;
  name: string;
  description: string;
  notes: string;
  creationDate: Date;
  stateDate: Date;
  dueDate: Date;
  completionStatus: completionStatus;
  completed: boolean;
};
