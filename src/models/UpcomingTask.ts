export type UpcomingTask = {
    project_name: string;
    task_id: number;
    name: string;
    due_date: Date;
    task_status: string;
    completed: boolean;
    priority: string;
}