// Bookkeeping API us used to fetch, update, add and remove bookkeeping
// and recurring expenses from the DB. It is also used to link projects
// and contacts to an entry

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { BKEntry } from 'src/models/BKEntry';
import type { BKExpense } from 'src/models/BKExpense';

export const bookkeepingAPI = createApi({
  reducerPath: 'bookkeepingAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/bookkeeping' }),

  endpoints: (builder) => ({
    fetchEntries: builder.query<
      { entries: BKEntry[]; recurringExpenses: BKExpense[] },
      number | undefined
    >({
      query: (accountID) => ({
        url: `/${accountID}`,
        method: 'GET',
      }),
    }),

    addEntry: builder.mutation<
      { newEntry: BKEntry; firstName: string; lastName: string },
      { newEntry: object; firstName: string; lastName: string }
    >({
      query: (body) => ({
        url: '/add',
        method: 'POST',
        body: body,
      }),
    }),

    updateEntry: builder.mutation<BKEntry, BKEntry>({
      query: (entry) => ({
        url: `/update/${entry.bookkeeping_id}`,
        method: 'PUT',
        body: entry,
      }),
    }),

    removeEntry: builder.mutation<number, number>({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    addRecurringExpense: builder.mutation<BKExpense, object>({
      query: (body) => ({
        url: '/add/expense',
        method: 'POST',
        body: body,
      }),
    }),
    updateRecurringExpense: builder.mutation<BKExpense, BKExpense>({
      query: (body) => ({
        url: `/update/expense/${body.re_id}`,
        method: 'PUT',
        body: body,
      }),
    }),
    removeRecurringExpense: builder.mutation<number, number>({
      query: (id) => ({
        url: `/delete/expense/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchEntriesQuery,
  useAddEntryMutation,
  useUpdateEntryMutation,
  useRemoveEntryMutation,
  useAddRecurringExpenseMutation,
  useUpdateRecurringExpenseMutation,
  useRemoveRecurringExpenseMutation,
} = bookkeepingAPI;
