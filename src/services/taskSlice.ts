// the task slice includes all references to the user's
// tasks.

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';
import { Task } from 'src/models/task';
import { taskAPI } from './taskAPI';
import { SubtaskSummary } from 'src/models/subtaskSummary';

interface taskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: Error | string | null;
}

const initialTaskState: taskState = {
  tasks: [],
  selectedTask: null,
  loading: 'idle',
  error: null,
};

export const taskSlice = createSlice({
  name: 'task',
  initialState: initialTaskState,
  reducers: {
    clearTaskState: () => initialTaskState,
    selectTask: (state, action: PayloadAction<Task>) => {
      state.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    // TASKS API
    builder.addMatcher(taskAPI.endpoints.fetchTasks.matchPending, (state) => {
      state.loading = 'pending';
      state.tasks = [];
    });

    builder.addMatcher(
      taskAPI.endpoints.fetchTasks.matchFulfilled,
      (state, action: PayloadAction<Task[]>) => {
        state.loading = 'fulfilled';
        state.tasks = action.payload;
      },
    );

    builder.addMatcher(taskAPI.endpoints.addTask.matchPending, (state) => {
      state.loading = 'pending';
    });
    builder.addMatcher(
      taskAPI.endpoints.addTask.matchFulfilled,
      (state, action: PayloadAction<Task>) => {
        state.loading = 'fulfilled';
        const newTask: Task = action.payload;
        newTask.subtasks = [];
        state.tasks.push(newTask);
      },
    );

    builder.addMatcher(taskAPI.endpoints.updateTask.matchPending, (state) => {
      state.loading = 'pending';
    });

    builder.addMatcher(
      taskAPI.endpoints.updateTask.matchFulfilled,
      (
        state,
        action: PayloadAction<{ task: Task; subtasks: SubtaskSummary[] }>,
      ) => {
        state.loading = 'fulfilled';
        const updatedTask = action.payload.task;
        const subtaskSummary = action.payload.subtasks;
        updatedTask.subtasks = subtaskSummary;
        const i = state.tasks.findIndex(
          (task) => task.task_id === updatedTask.task_id,
        );
        if (i !== -1) {
          state.tasks[i] = updatedTask;
          state.selectedTask = updatedTask;
        }
      },
    );

    builder.addMatcher(taskAPI.endpoints.removeTask.matchPending, (state) => {
      state.loading = 'pending';
    });

    builder.addMatcher(
      taskAPI.endpoints.removeTask.matchFulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = 'fulfilled';
        const removedTaskId = action.payload;
        state.tasks = state.tasks.filter(
          (task) => task.task_id != removedTaskId,
        );
      },
    );
  },
});

export const getTasks = (state: RootState) => state.taskReducer.tasks;

export const { clearTaskState, selectTask } =
  taskSlice.actions;
export default taskSlice.reducer;
