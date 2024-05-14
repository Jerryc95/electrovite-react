import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { UpcomingTask } from 'src/models/UpcomingTask';
import type { UpcomingEvent } from 'src/models/upcomingEvent';
import type { BKEntry } from 'src/models/BKEntry';

export const homeAPI = createApi({
  reducerPath: 'homeAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/home' }),
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

    fetchRevenue: builder.query<BKEntry[], number | undefined>({
      query: (accountID) => ({
        url: `/revenue/${accountID}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useFetchRevenueQuery,
  useFetchUpcomingEventsQuery,
  useFetchUpcomingTasksQuery,
} = homeAPI;
