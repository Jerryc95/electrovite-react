// Home manages the data that a user views on their dashboard and
// across pages

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';
import { UpcomingTask } from 'src/models/UpcomingTask';
import { UpcomingEvent } from 'src/models/upcomingEvent';
import { BKEntry } from 'src/models/BKEntry';
import { homeAPI } from './homeAPI';
import { BKExpense } from 'src/models/BKExpense';

interface homeState {
  upcomingTasks: UpcomingTask[];
  upcomingEvents: UpcomingEvent[];
  revenue: BKEntry[];
  expenses: BKEntry[];
  recurringExpenses: BKExpense[];
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
}

const initialHomeState: homeState = {
  upcomingTasks: [],
  upcomingEvents: [],
  revenue: [],
  expenses: [],
  recurringExpenses: [],
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

    builder.addMatcher(homeAPI.endpoints.fetchEntries.matchPending, (state) => {
      state.loading = 'pending';
    });

    builder.addMatcher(
      homeAPI.endpoints.fetchEntries.matchFulfilled,
      (
        state,
        action: PayloadAction<{ revenue: BKEntry[]; expenses: BKEntry[] }>,
      ) => {
        state.loading = 'fulfilled';
        const revenue = action.payload.revenue;
        const expenses = action.payload.expenses;
        state.revenue = revenue;
        state.expenses = expenses;
      },
    );

    builder.addMatcher(
      homeAPI.endpoints.fetchExpenses.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      homeAPI.endpoints.fetchExpenses.matchFulfilled,
      (state, action: PayloadAction<BKExpense[]>) => {
        state.loading = 'fulfilled';
        const expenses: BKExpense[] = [];

        for (const expense of action.payload) {
          if (expense.is_active) {
            expenses.push(expense);
          }
        }

        state.recurringExpenses = expenses;
      },
    );
  },
});

export const getUpcomingTasks = (state: RootState) =>
  state.homeReducer.upcomingTasks;
export const getUpcomingEvents = (state: RootState) =>
  state.homeReducer.upcomingEvents;
export const getRevenue = (state: RootState) => state.homeReducer.revenue;
export const getExpenses = (state: RootState) => state.homeReducer.expenses;
export const getRecurringExpenses = (state: RootState) =>
  state.homeReducer.recurringExpenses;

export default homeSlice.reducer;
