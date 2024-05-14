// Home manages the data that a user views on their dashboard and
// across pages

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';
import { UpcomingTask } from 'src/models/UpcomingTask';
import { UpcomingEvent } from 'src/models/upcomingEvent';
import { BKEntry } from 'src/models/BKEntry';
import { homeAPI } from './homeAPI';

interface homeState {
  upcomingTasks: UpcomingTask[];
  upcomingEvents: UpcomingEvent[];
  revenue: BKEntry[];
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
}

const initialHomeState: homeState = {
  upcomingTasks: [],
  upcomingEvents: [],
  revenue: [],
  loading: 'idle',
  error: null,
};

export const homeSlice = createSlice({
  name: 'home',
  initialState: initialHomeState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      homeAPI.endpoints.fetchUpcomingTasks.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      homeAPI.endpoints.fetchUpcomingTasks.matchFulfilled,
      (state, action: PayloadAction<UpcomingTask[]>) => {
        state.loading = 'fulfilled';
        const upcomingTasks = action.payload;
        state.upcomingTasks = upcomingTasks;
      },
    );

    builder.addMatcher(
      homeAPI.endpoints.fetchUpcomingEvents.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      homeAPI.endpoints.fetchUpcomingEvents.matchFulfilled,
      (state, action: PayloadAction<UpcomingEvent[]>) => {
        state.loading = 'fulfilled';
        state.upcomingEvents = action.payload;
      },
    );

    builder.addMatcher(homeAPI.endpoints.fetchRevenue.matchPending, (state) => {
      state.loading = 'pending';
    });

    builder.addMatcher(
      homeAPI.endpoints.fetchRevenue.matchFulfilled,
      (state, action: PayloadAction<BKEntry[]>) => {
        state.loading = 'fulfilled';
        const entries = action.payload;
        state.revenue = entries;
      },
    );
  },
});

export const selectedUpcomingTasks = (state: RootState) =>
  state.homeReducer.upcomingTasks;
export const selectedUpcomingEvents = (state: RootState) =>
  state.homeReducer.upcomingEvents;
export const selectedRevenue = (state: RootState) => state.homeReducer.revenue;

export default homeSlice.reducer;
