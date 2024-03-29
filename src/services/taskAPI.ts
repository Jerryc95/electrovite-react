// Task API is used to fetch, update, add and remove tasks in the DB

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Task } from 'src/models/task';

export const taskAPI = createApi({
  reducerPath: 'taskAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/tasks' }),

  endpoints: (builder) => ({
    fetchTasks: builder.query<Task[], number>({
      query: (projectID) => ({
        url: `/${projectID}`,
        method: 'GET',
      }),
    }),
    addTask: builder.mutation<Task, object>({
      query: (body) => ({
        url: '/add',
        method: 'POST',
        body: body,
      }),
    }),
    updateTask: builder.mutation<Task, {
        taskID: number;
        taskStatus?: string;
        columnIndex?: number;
        name?: string | null;
        startDate?: Date | null | undefined;
        endDate?: Date | null | undefined;
      } >({
      query: (task) => ({
        url: `/update/${task.taskID}`,
        method: 'PUT',
        body: task,
      }),
    }),
    removeTask: builder.mutation<Task, number>({
      query: (taskID) => ({
        url: `/delete/${taskID}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useRemoveTaskMutation,
} = taskAPI;
