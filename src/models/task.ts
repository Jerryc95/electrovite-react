import { Subtask } from "./subTask";

export type Task = {
    task_id: number;
    project_id: string;
    name: string;
    description: string;
    notes: string;
    creation_date: Date;
    start_date: Date;
    due_date: Date;
    task_status: string;
    completed: Date;
    priority: string;
    column_index: number;
    subtasks: Subtask[];
}