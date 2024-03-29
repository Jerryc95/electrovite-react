// Subtask API is used to fetch, update, add and remove subtasks in the DB

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Subtask } from 'src/models/subTask';

export const subtaskAPI = createApi({
  reducerPath: 'subtaskAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/tasks' }),

  endpoints: (builder) => ({
    fetchSubtasks: builder.query<Subtask[], number>({
      query: (projectID) => ({
        url: `/${projectID}`,
        method: 'GET',
      }),
    }),
    addSubtask: builder.mutation<Subtask, object>({
      query: (body) => ({
        url: '/tasks/add',
        method: 'POST',
        body: body,
      }),
    }),
    updateSubtask: builder.mutation<Subtask, Subtask>({
      query: (subtask) => ({
        url: `/update/${subtask.subtask_id}`,
        method: 'PUT',
        body: subtask,
      }),
    }),
    removeSubtask: builder.mutation<Subtask, number>({
      query: (subtaskID) => ({
        url: `/delete/${subtaskID}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchSubtasksQuery,
  useAddSubtaskMutation,
  useUpdateSubtaskMutation,
  useRemoveSubtaskMutation,
} = subtaskAPI;
