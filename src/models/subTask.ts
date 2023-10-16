import { completionStatus } from 'src/statuses/projectStatus';

export type SubTask = {
  subTaskID: string;
  taskID: string;
  name: string;
  description: string;
  notes: string;
  creationDate: Date;
  stateDate: Date;
  dueDate: Date;
  completionStatus: completionStatus;
  completed: boolean;
};
