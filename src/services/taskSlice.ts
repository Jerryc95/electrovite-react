// the task slice includes all references to the user's
// tasks and subtasks.

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';
import { Task } from 'src/models/task';
import { Subtask } from 'src/models/subTask';
import { taskAPI } from './taskAPI';
import { subtaskAPI } from './subtaskAPI';

interface taskState {
  upcomingTasks: Task[];
  tasks: Task[];
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: Error | string | null;
}

const initialTaskState: taskState = {
  upcomingTasks: [],
  tasks: [],
  loading: 'idle',
  error: null,
};

export const taskSlice = createSlice({
  name: 'project',
  initialState: initialTaskState,
  reducers: {
    clearTaskState: () => initialTaskState,
  },
  extraReducers: (builder) => {
    // TASKS API
    builder.addMatcher(taskAPI.endpoints.fetchTasks.matchPending, (state) => {
      state.loading = 'pending';
    });

    builder.addMatcher(
      taskAPI.endpoints.fetchTasks.matchFulfilled,
      (state, action: PayloadAction<Task[]>) => {
        state.loading = 'fulfilled';
        state.tasks = action.payload;
        // console.log('payload', action.payload);
      },
    );
    builder.addMatcher(
      taskAPI.endpoints.fetchUpcomingTasks.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      taskAPI.endpoints.fetchUpcomingTasks.matchFulfilled,
      (state, action: PayloadAction<Task[]>) => {
        state.loading = 'fulfilled';
        state.upcomingTasks = action.payload;
        console.log('upcoming Tasks:', action.payload)
      },
    );

    builder.addMatcher(taskAPI.endpoints.addTask.matchPending, (state) => {
      state.loading = 'pending';
    });
    builder.addMatcher(
      taskAPI.endpoints.addTask.matchFulfilled,
      (state, action: PayloadAction<Task>) => {
        state.loading = 'fulfilled';
        console.log(action.payload);
        state.tasks.push(action.payload);
      },
    );

    builder.addMatcher(taskAPI.endpoints.updateTask.matchPending, (state) => {
      state.loading = 'pending';
    });

    builder.addMatcher(
      taskAPI.endpoints.updateTask.matchFulfilled,
      (state, action: PayloadAction<Task>) => {
        state.loading = 'fulfilled';
        console.log(action.payload);
        const updatedTask = action.payload;

        const i = state.tasks.findIndex(
          (task) => task.task_id === updatedTask.task_id,
        );
        if (i !== -1) {
          state.tasks[i] = updatedTask;
        }
      },
    );

    builder.addMatcher(taskAPI.endpoints.removeTask.matchPending, (state) => {
      state.loading = 'pending';
    });

    builder.addMatcher(
      taskAPI.endpoints.removeTask.matchFulfilled,
      (state, action: PayloadAction<Task>) => {
        state.loading = 'fulfilled';
        const taskToRemove = action.payload;
        state.tasks = state.tasks.filter(
          (task) => task.task_id != taskToRemove.task_id,
        );
      },
    );

    // SUBTASK API
    builder.addMatcher(
      subtaskAPI.endpoints.addSubtask.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      subtaskAPI.endpoints.addSubtask.matchFulfilled,
      (state, action: PayloadAction<Subtask>) => {
        state.loading = 'fulfilled';

        const index = state.tasks.findIndex(
          (task) => task.task_id === action.payload.task_id,
        );

        if (index !== -1) {
          state.tasks[index].subtasks.push(action.payload);
        }
      },
    );

    builder.addMatcher(
      subtaskAPI.endpoints.updateSubtask.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      subtaskAPI.endpoints.updateSubtask.matchFulfilled,
      (state, action: PayloadAction<Subtask>) => {
        state.loading = 'fulfilled';

        const taskIndex = state.tasks.findIndex(
          (task) => task.task_id === action.payload.task_id,
        );

        if (taskIndex !== -1) {
          const subtaskIndex = state.tasks[taskIndex].subtasks.findIndex(
            (subtask) => subtask.subtask_id === action.payload.subtask_id,
          );
          if (subtaskIndex != -1) {
            state.tasks[taskIndex].subtasks[subtaskIndex] = action.payload;
          }
        }
      },
    );

    builder.addMatcher(
      subtaskAPI.endpoints.removeSubtask.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      subtaskAPI.endpoints.removeSubtask.matchFulfilled,
      (state, action: PayloadAction<Subtask>) => {
        state.loading = 'fulfilled';

        const taskIndex = state.tasks.findIndex(
          (task) => task.task_id === action.payload.task_id,
        );

        if (taskIndex != -1) {
          const updatedSubtasks = state.tasks[taskIndex].subtasks.filter(
            (subtask) => subtask.subtask_id != action.payload.subtask_id,
          );
          state.tasks[taskIndex].subtasks = updatedSubtasks;
        }
      },
    );
  },
});

export const selectedTasks = (state: RootState) => state.taskReducer.tasks;

export const { clearTaskState } = taskSlice.actions;
export default taskSlice.reducer;
