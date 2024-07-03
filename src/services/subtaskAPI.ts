// Subtask API is used to fetch, update, add and remove subtasks in the DB

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// import { Subtask } from 'src/models/subTask';
import type { Subtask } from 'src/models/subtask';

export const subtaskAPI = createApi({
  reducerPath: 'subtaskAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/subtasks' }),

  endpoints: (builder) => ({
    fetchSubtasks: builder.query<Subtask[], number>({
      query: (subtaskID) => ({
        url: `/${subtaskID}`,
        method: 'GET',
      }),
    }),
    addSubtask: builder.mutation<Subtask, object>({
      query: (body) => ({
        url: '/add',
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
    removeSubtask: builder.mutation<number, number>({
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
