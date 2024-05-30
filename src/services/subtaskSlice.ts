// the subtask slice handles all subtask references

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';
// import { Subtask } from 'src/models/subTask';
import { Subtask } from 'src/models/subtask';
import { subtaskAPI } from './subtaskAPI';

interface subtaskState {
  subtasks: Subtask[];
  selectedSubtask: Subtask | null;
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: Error | string | null;
}

const initialSubtaskState: subtaskState = {
  subtasks: [],
  selectedSubtask: null,
  loading: 'idle',
  error: null,
};

export const subtaskSlice = createSlice({
  name: 'subtask',
  initialState: initialSubtaskState,
  reducers: {
    clearSubtaskState: () => initialSubtaskState,
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      subtaskAPI.endpoints.fetchSubtasks.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );
    builder.addMatcher(
      subtaskAPI.endpoints.fetchSubtasks.matchFulfilled,
      (state, action: PayloadAction<Subtask[]>) => {
        // console.log(action.payload)
        state.loading = 'fulfilled';
        state.subtasks = action.payload;
        // console.log(state.subtasks)
      },
    );

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
        console.log(action.payload)
        state.subtasks.push(action.payload);
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
        const updatedSubtask = action.payload;
        console.log(updatedSubtask)
        const index = state.subtasks.findIndex(
          (subtasks) => subtasks.subtask_id === action.payload.subtask_id,
        );

        if (index !== -1) {
          state.subtasks[index] = updatedSubtask;
          state.selectedSubtask = updatedSubtask;
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
      (state, action: PayloadAction<number>) => {
        state.loading = 'fulfilled';
        const removedSubtaskId = action.payload;

        state.subtasks = state.subtasks.filter(
          (subtask) => subtask.subtask_id != removedSubtaskId,
        );
      },
    );
  },
});

export const getSubtasks = (state: RootState) =>
  state.subtaskReducer.subtasks;

export const { clearSubtaskState } = subtaskSlice.actions;
export default subtaskSlice.reducer;
