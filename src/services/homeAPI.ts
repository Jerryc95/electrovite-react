import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { UpcomingTask } from 'src/models/UpcomingTask';
import type { UpcomingEvent } from 'src/models/upcomingEvent';
import type { BKEntry } from 'src/models/BKEntry';
import { BKExpense } from 'src/models/BKExpense';

export const homeAPI = createApi({
  reducerPath: 'homeAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://flowplanr-production.up.railway.app/home' }),
  endpoints: (builder) => ({
    fetchUpcomingTasks: builder.query<UpcomingTask[], number | undefined>({
      query: (accountID) => ({
        url: `/upcoming-tasks/${accountID}`,
        method: 'GET',
      }),
    }),

    fetchUpcomingEvents: builder.query<UpcomingEvent[], number | undefined>({
      query: (accountID) => ({
        url: `/upcoming-events/${accountID}`,
        method: 'GET',
      }),
    }),

    fetchEntries: builder.query<
      { revenue: BKEntry[]; expenses: BKEntry[] },
      number | undefined
    >({
      query: (accountID) => ({
        url: `/entries/${accountID}`,
        method: 'GET',
      }),
    }),
    fetchExpenses: builder.query<BKExpense[], number | undefined>({
      query: (accountID) => ({
        url: `/recurring-expenses/${accountID}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useFetchEntriesQuery,
  useFetchUpcomingEventsQuery,
  useFetchUpcomingTasksQuery,
  useFetchExpensesQuery,
} = homeAPI;
