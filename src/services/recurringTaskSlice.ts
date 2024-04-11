// the recurring task slice includes all references to the users'
// recurring tasks.

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';
import { RecurringTask } from 'src/models/recurringTask';
import { recurringTaskAPI } from './recurringTaskAPI';

interface recurringTaskState {
  recurringTasks: RecurringTask[];
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
}

const initialRecurringTaskState: recurringTaskState = {
  recurringTasks: [],
  loading: 'idle',
  error: null,
};

export const recurringTaskSlice = createSlice({
  name: 'recurringTask',
  initialState: initialRecurringTaskState,
  reducers: {
    clearRecurringTaskState: () => initialRecurringTaskState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      recurringTaskAPI.endpoints.fetchRecurringTasks.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      recurringTaskAPI.endpoints.fetchRecurringTasks.matchFulfilled,
      (state, action: PayloadAction<RecurringTask[]>) => {
        state.loading = 'fulfilled';
        state.recurringTasks = action.payload;
      },
    );

    builder.addMatcher(
      recurringTaskAPI.endpoints.addRecurringTask.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      recurringTaskAPI.endpoints.addRecurringTask.matchFulfilled,
      (state, action: PayloadAction<RecurringTask>) => {
        state.loading = 'fulfilled';
        state.recurringTasks.push(action.payload);
      },
    );

    builder.addMatcher(
      recurringTaskAPI.endpoints.updateRecurringTask.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      recurringTaskAPI.endpoints.updateRecurringTask.matchFulfilled,
      (state, action: PayloadAction<RecurringTask>) => {
        state.loading = 'fulfilled';
        const updatedRecurringTask = action.payload;
        const index = state.recurringTasks.findIndex(
          (recurringTask) => recurringTask.rt_id == updatedRecurringTask.rt_id,
        );
        if (index !== -1) {
          state.recurringTasks[index] = action.payload;
        }
      },
    );

    builder.addMatcher(
      recurringTaskAPI.endpoints.removeRecurringTask.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      recurringTaskAPI.endpoints.removeRecurringTask.matchFulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = 'fulfilled';
        const recurringTaskID = Number(action.payload);
        const updatedRecurringTasks = state.recurringTasks.filter(
          (recurringTask) => recurringTask.rt_id !== recurringTaskID,
        );
        state.recurringTasks = updatedRecurringTasks;
      },
    );
  },
});

export const selectedRecurringTasks = (state: RootState) =>
  state.recurringTaskReducer.recurringTasks;
export const { clearRecurringTaskState } = recurringTaskSlice.actions;
export default recurringTaskSlice.reducer;
