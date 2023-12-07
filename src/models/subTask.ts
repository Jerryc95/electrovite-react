export type Subtask = {
  subtask_id: number;
  task_id: string;
  name: string;
  description: string;
  notes: string;
  creation_date: Date;
  start_date: Date;
  due_date: Date;
  subtask_status: string;
  completed: Date;
  priority: string;
  column_index: number;
};
