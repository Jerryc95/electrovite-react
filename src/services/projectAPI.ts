// Project API is used to fetch, update, add and remove projects from the DB.

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Project } from 'src/models/project';

export const projectAPI = createApi({
  reducerPath: 'projectAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/projects' }),

  endpoints: (builder) => ({
    fetchProjects: builder.query<Project[], number | undefined>({
      query: (accountID) => ({
        url: `/${accountID}`,
        method: 'GET',
      }),
    }),

    addProject: builder.mutation<Project, object>({
      query: (body) => ({
        url: '/add',
        method: 'POST',
        body: body,
      }),
    }),
    updateProject: builder.mutation<Project, Project>({
      query: (project) => ({
        url: `/update/${project.id}`,
        method: 'PUT',
        body: project,
      }),
    }),
    removeProject: builder.mutation<number, number>({
      query: (projectID) => ({
        url: `/delete/${projectID}`,
        method: 'DELETE',
      }),
    }),

    
    fetchContactProjects: builder.mutation<
      Project[],
      { accountID: number; contactID: number }
    >({
      query: (body) => ({
        url: `/contacts?accountID=${body.accountID}&contactID=${body.contactID}`,
        method: 'get',
      }),
    }),
  }),
});

export const {
  useFetchProjectsQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useRemoveProjectMutation,
  useFetchContactProjectsMutation,
} = projectAPI;
