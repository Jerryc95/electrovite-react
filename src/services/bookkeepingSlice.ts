// the bookkeeping slice includes all references to the user's
// bookeeping entries.

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';
import { BKEntry } from 'src/models/BKEntry';
import { bookkeepingAPI } from './bookkeepingAPI';
import { BKExpense } from 'src/models/BKExpense';

interface bookkeepingState {
  entries: BKEntry[];
  revenueEntries: BKEntry[];
  expenseEntries: BKEntry[];
  recurringExpenses: BKExpense[];
  selectedEntry: BKEntry | null;
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
}

const initialBookkeepingState: bookkeepingState = {
  entries: [],
  revenueEntries: [],
  expenseEntries: [],
  recurringExpenses: [],
  selectedEntry: null,
  loading: 'idle',
  error: null,
};

export const bookkeepingSlice = createSlice({
  name: 'bookkeeping',
  initialState: initialBookkeepingState,
  reducers: {
    clearBookkeepingState: () => initialBookkeepingState,
    setSelectedEntry: (state, action: PayloadAction<BKEntry>) => {
      state.selectedEntry = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      bookkeepingAPI.endpoints.fetchEntries.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      bookkeepingAPI.endpoints.fetchEntries.matchFulfilled,
      (
        state,
        action: PayloadAction<{
          entries: BKEntry[];
          recurringExpenses: BKExpense[];
        }>,
      ) => {
        state.loading = 'fulfilled';
        const entries = action.payload.entries;
        const recurringExpenses = action.payload.recurringExpenses;
        state.entries = entries;
        state.recurringExpenses = recurringExpenses;
        state.expenseEntries = []
        state.revenueEntries = []
        entries.forEach((entry) => {
          if (entry.transaction_type === 'Income') {
            state.revenueEntries.push(entry);
          }
          if (entry.transaction_type === 'Expense') {
            state.expenseEntries.push(entry);
          }
        });
      },
    );
    builder.addMatcher(
      bookkeepingAPI.endpoints.addEntry.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );
    builder.addMatcher(
      bookkeepingAPI.endpoints.addEntry.matchFulfilled,
      (
        state,
        action: PayloadAction<{
          newEntry: BKEntry;
          firstName: string;
          lastName: string;
        }>,
      ) => {
        state.loading = 'fulfilled';
        const newEntry = action.payload.newEntry;
        newEntry.first_name = action.payload.firstName;
        newEntry.last_name = action.payload.lastName;
        state.entries.push(newEntry);
        if (newEntry.transaction_type === 'Income') {
          state.revenueEntries.push(newEntry);
        }
        if (newEntry.transaction_type === 'Expense') {
          state.expenseEntries.push(newEntry);
        }
      },
    );

    builder.addMatcher(
      bookkeepingAPI.endpoints.updateEntry.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      bookkeepingAPI.endpoints.updateEntry.matchFulfilled,
      (state, action: PayloadAction<BKEntry>) => {
        state.loading = 'fulfilled';
        const updatedEntry = action.payload;
        const entryIndex = state.entries.findIndex(
          (entry) => entry.bookkeeping_id === updatedEntry.bookkeeping_id,
        );
        const revenueEntryIndex = state.revenueEntries.findIndex(
          (entry) => entry.bookkeeping_id === updatedEntry.bookkeeping_id,
        );
        const expenseEntriesIndex = state.expenseEntries.findIndex(
          (entry) => entry.bookkeeping_id === updatedEntry.bookkeeping_id,
        );
        if (entryIndex !== -1) {
          state.entries[entryIndex] = updatedEntry;
          state.selectedEntry =  updatedEntry
        }
        if (revenueEntryIndex !== -1) {
          state.revenueEntries[revenueEntryIndex] = updatedEntry;
        }
        if (expenseEntriesIndex !== -1) {
          state.expenseEntries[expenseEntriesIndex] = updatedEntry;
        }
      },
    );

    builder.addMatcher(
      bookkeepingAPI.endpoints.removeEntry.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );
    builder.addMatcher(
      bookkeepingAPI.endpoints.removeEntry.matchFulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = 'fulfilled';
        const payloadNumber = action.payload;
        const updatedEntries = state.entries.filter(
          (entry) => entry.bookkeeping_id !== payloadNumber,
        );
        const updatedRevenueEntries = state.revenueEntries.filter(
          (entry) => entry.bookkeeping_id !== payloadNumber,
        );
        const updatedExpenseEntries = state.expenseEntries.filter(
          (entry) => entry.bookkeeping_id !== payloadNumber,
        );
        state.entries = updatedEntries;
        state.revenueEntries = updatedRevenueEntries;
        state.expenseEntries = updatedExpenseEntries;
      },
    );

    builder.addMatcher(
      bookkeepingAPI.endpoints.addRecurringExpense.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      bookkeepingAPI.endpoints.addRecurringExpense.matchFulfilled,
      (state, action: PayloadAction<BKExpense>) => {
        state.loading = 'fulfilled';
        const newExpense = action.payload;
        state.recurringExpenses.push(newExpense);
      },
    );

    builder.addMatcher(
      bookkeepingAPI.endpoints.updateRecurringExpense.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      bookkeepingAPI.endpoints.updateRecurringExpense.matchFulfilled,
      (state, action: PayloadAction<BKExpense>) => {
        state.loading = 'fulfilled';
        const updatedExpense = action.payload;
        const index = state.recurringExpenses.findIndex(
          (expense) => expense.re_id === updatedExpense.re_id,
        );
        state.recurringExpenses[index] = updatedExpense;
      },
    );

    builder.addMatcher(
      bookkeepingAPI.endpoints.removeRecurringExpense.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      bookkeepingAPI.endpoints.removeRecurringExpense.matchFulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = 'fulfilled';
        const payloadNumber = action.payload;
        const updatedExpenses = state.recurringExpenses.filter(
          (expense) => expense.re_id !== payloadNumber,
        );
        state.recurringExpenses = updatedExpenses;
      },
    );
  },
});

export const getEntries = (state: RootState) =>
  state.bookkeepingReducer.entries;
export const getRevenueEntries = (state: RootState) =>
  state.bookkeepingReducer.revenueEntries;
export const getExpenseEntries = (state: RootState) =>
  state.bookkeepingReducer.expenseEntries;
export const getRecurringExpenses = (state: RootState) =>
  state.bookkeepingReducer.recurringExpenses;

export const { clearBookkeepingState, setSelectedEntry } =
  bookkeepingSlice.actions;

export default bookkeepingSlice.reducer;
