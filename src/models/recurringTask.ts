export type RecurringTask = {
    rt_id: number;
    account_id: number;
    task: string;
    frequency: string;
    is_completed: boolean;
    last_updated_at: Date;
}

