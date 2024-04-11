// Recurring Task API is used t ofetch, update and remove any recurring tasks

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { RecurringTask } from 'src/models/recurringTask';

export const recurringTaskAPI = createApi({
  reducerPath: 'recurringTaskAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/recurringTasks',
  }),

  endpoints: (builder) => ({
    fetchRecurringTasks: builder.query<RecurringTask[], number | undefined>({
      query: (accountID) => ({
        url: `/${accountID}`,
        method: 'GET',
      }),
    }),

    addRecurringTask: builder.mutation<RecurringTask, object>({
      query: (body) => ({
        url: '/add',
        method: 'POST',
        body: body,
      }),
    }),
    updateRecurringTask: builder.mutation<RecurringTask, RecurringTask>({
      query: (recurringTask) => ({
        url: `/update/${recurringTask.rt_id}`,
        method: 'PUT',
        body: recurringTask,
      }),
    }),
    removeRecurringTask: builder.mutation<number, number>({
      query: (recurringTaskID) => ({
        url: `/delete/${recurringTaskID}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchRecurringTasksQuery,
  useAddRecurringTaskMutation,
  useUpdateRecurringTaskMutation,
  useRemoveRecurringTaskMutation,
} = recurringTaskAPI;
