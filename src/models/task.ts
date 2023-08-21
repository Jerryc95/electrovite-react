import { completionStatus } from "src/enums/completionStatus";

export type Task = {
    taskID: string;
    projectID: string;
    name: string;
    description: string;
    notes: string;
    creationDate: Date;
    stateDate: Date;
    dueDate: Date;
    completionStatus: completionStatus;
    completed: boolean;
}