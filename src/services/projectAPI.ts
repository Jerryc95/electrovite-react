// Project API is used to fetch, update, add and remove projects from the DB.

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Project } from 'src/models/project';

export const projectAPI = createApi({
  reducerPath: 'projectAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://flowplanr-production.up.railway.app/projects' }),

  endpoints: (builder) => ({
    fetchProjects: builder.query<Project[], number | undefined>({
      query: (accountID) => ({
        url: `/${accountID}`,
        method: 'GET',
      }),
    }),

    fetchProject: builder.query<Project, number>({
      query: (projectID) => ({
        url: `/${projectID}`,
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

    fetchProjectsByContact: builder.query<
      Project[],
      { accountID: number | undefined; contactID: number }
    >({
      query: (query) => ({
        url: `/contact?accountID=${query.accountID}&contactID=${query.contactID}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useFetchProjectsQuery,
  useFetchProjectQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useRemoveProjectMutation,
  useFetchProjectsByContactQuery,
} = projectAPI;
