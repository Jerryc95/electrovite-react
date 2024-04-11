// contacts api manages contacts and their events

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Contact } from 'src/models/contact';

export const contactAPI = createApi({
  reducerPath: 'contactAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/contacts' }),

  endpoints: (builder) => ({
    fetchContacts: builder.query<Contact[], number | undefined>({
      query: (accountID) => ({
        url: `/${accountID}`,
        method: 'GET',
      }),
    }),
    addContact: builder.mutation<Contact, object>({
      query: (contact) => ({
        url: '/add',
        method: 'POST',
        body: contact,
      }),
    }),

    updateContact: builder.mutation<Contact, Contact>({
      query: (contact) => ({
        url: '/add',
        method: 'POST',
        body: contact,
      }),
    }),

    removeContact: builder.mutation<number, number>({
      query: (contactID) => ({
        url: `/delete/${contactID}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useFetchContactsQuery,
  useAddContactMutation,
  useUpdateContactMutation,
  useRemoveContactMutation,
} = contactAPI;
