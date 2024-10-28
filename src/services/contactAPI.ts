// contacts api manages contacts and their events

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Contact } from 'src/models/contact';
import { ContactEvent } from 'src/models/contactEvent';

export const contactAPI = createApi({
  reducerPath: 'contactAPI',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://flowplanr-production.up.railway.app/contacts' }),

  endpoints: (builder) => ({
    /////////////////////
    //    CONTACTS    //
    ///////////////////
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
        url: `/update/${contact.id}`,
        method: 'PUT',
        body: contact,
      }),
    }),

    removeContact: builder.mutation<Contact, Contact>({
      query: (contact) => ({
        url: `/delete/${contact.id}`,
        method: 'DELETE',
      }),
    }),
    /////////////////////
    // CONTACT EVENTS //
    ///////////////////
    addContactEvent: builder.mutation<ContactEvent, object>({
      query: (newEvent) => ({
        url: '/add/event',
        method: 'POST',
        body: newEvent,
      }),
    }),
    updateContactEvent: builder.mutation<ContactEvent, ContactEvent>({
      query: (event) => ({
        url: `/update/event/${event.event_id}`,
        method: 'PUT',
        body: event,
      }),
    }),
    removeContactEvent: builder.mutation<
      { contactID: number; eventID: number },
      ContactEvent
    >({
      query: (event) => ({
        url: `/delete/event/${event.event_id}`,
        method: 'DELETE',
        body: event,
      }),
    }),
  }),
});

export const {
  useFetchContactsQuery,
  useAddContactMutation,
  useUpdateContactMutation,
  useRemoveContactMutation,
  useAddContactEventMutation,
  useUpdateContactEventMutation,
  useRemoveContactEventMutation,
} = contactAPI;
