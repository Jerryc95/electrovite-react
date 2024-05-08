// Task API is used to fetch, update, add and remove tasks in the DB

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Task } from 'src/models/task';
import { SubtaskSummary } from 'src/models/subtaskSummary';

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

    fetchUpcomingTasks: builder.query<Task[], number | undefined>({
      query: (accountID) => ({
        url: `/upcoming/${accountID}`,
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
    updateTask: builder.mutation<
      { task: Task; subtasks: SubtaskSummary[] },
      Task
    >({
      query: (task) => ({
        url: `/update/${task.task_id}`,
        method: 'PUT',
        body: task,
      }),
    }),
    removeTask: builder.mutation<number, number>({
      query: (taskID) => ({
        url: `/delete/${taskID}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchTasksQuery,
  useFetchUpcomingTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useRemoveTaskMutation,
} = taskAPI;
