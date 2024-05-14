interface ISubtask {
    subtask_id: number;
    task_id: number;
    subtask_status: string;
  }
  
export type UpcomingTask = {
    project_name: string;
    task_id: number;
    name: string;
    due_date: Date;
    task_status: string;
    completed: boolean;
    priority: string;
    subtasks: ISubtask[];
}