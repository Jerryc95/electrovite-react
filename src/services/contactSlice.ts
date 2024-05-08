// this slice holds references to the user's contacts

import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from './store';
import { Contact } from 'src/models/contact';
import { contactAPI } from './contactAPI';
import { ContactEvent } from 'src/models/contactEvent';

interface contactState {
  contacts: Contact[];
  selectedContact: Contact | null;
  loading: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: string | null;
}

const initialContactState: contactState = {
  contacts: [],
  selectedContact: null,
  loading: 'idle',
  error: null,
};

export const contactSlice = createSlice({
  name: 'contact',
  initialState: initialContactState,
  reducers: {
    clearContactState: () => initialContactState,
    selectContact: (state, action: PayloadAction<Contact>) => {
      state.selectedContact = action.payload;
    },
  },
  extraReducers: (builder) => {
    /////////////////////
    //    CONTACTS    //
    ///////////////////
    builder.addMatcher(
      contactAPI.endpoints.fetchContacts.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );
    builder.addMatcher(
      contactAPI.endpoints.fetchContacts.matchFulfilled,
      (state, action: PayloadAction<Contact[]>) => {
        state.loading = 'fulfilled';
        state.contacts = action.payload;
        // state.contacts.forEach((contact) => contact.events = [])
      },
    );
    builder.addMatcher(
      contactAPI.endpoints.addContact.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );
    builder.addMatcher(
      contactAPI.endpoints.addContact.matchFulfilled,
      (state, action: PayloadAction<Contact>) => {
        state.loading = 'fulfilled';
        const newContact = action.payload;
        newContact.events = [];
        state.contacts.push(newContact);
      },
    );
    builder.addMatcher(
      contactAPI.endpoints.updateContact.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );
    builder.addMatcher(
      contactAPI.endpoints.updateContact.matchFulfilled,
      (state, action: PayloadAction<Contact>) => {
        state.loading = 'fulfilled';
        const updatedContact = action.payload;

        console.log(updatedContact);
        const index = state.contacts.findIndex(
          (contact) => contact.id == updatedContact.id,
        );
        if (index !== -1 && state.selectedContact !== null) {
          updatedContact.events = state.selectedContact.events;
          state.contacts[index] = updatedContact;
          state.selectedContact = updatedContact;
        }
      },
    );
    builder.addMatcher(
      contactAPI.endpoints.removeContact.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );
    builder.addMatcher(
      contactAPI.endpoints.removeContact.matchFulfilled,
      (state, action: PayloadAction<Contact>) => {
        state.loading = 'pending';
        const updatedContacts = state.contacts.filter(
          (contact) => contact.id !== action.payload.id,
        );
        state.contacts = updatedContacts;
      },
    );

    /////////////////////
    // CONTACT EVENTS //
    ///////////////////
    builder.addMatcher(
      contactAPI.endpoints.addContactEvent.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );
    builder.addMatcher(
      contactAPI.endpoints.addContactEvent.matchFulfilled,
      (state, action: PayloadAction<ContactEvent>) => {
        state.loading = 'fulfilled';
        const newEvent = action.payload;
        const index = state.contacts.findIndex(
          (contact) => contact.id == newEvent.contact_id,
        );
        if (index !== -1 && state.selectedContact !== null) {
          state.contacts[index].events.push(newEvent);
          state.selectedContact.events.push(newEvent);
        }
      },
    );
    builder.addMatcher(
      contactAPI.endpoints.updateContactEvent.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );

    builder.addMatcher(
      contactAPI.endpoints.updateContactEvent.matchFulfilled,
      (state, action: PayloadAction<ContactEvent>) => {
        state.loading = 'fulfilled';
        const updatedContactEvent = action.payload;
        const contactIndex = state.contacts.findIndex(
          (contact) => contact.id == updatedContactEvent.contact_id,
        );
        if (contactIndex !== -1 && state.selectedContact !== null) {
          const eventIndex = state.contacts[contactIndex].events.findIndex(
            (event) => event.event_id == updatedContactEvent.event_id,
          );
          if (eventIndex !== -1) {
            state.contacts[contactIndex].events[eventIndex] =
              updatedContactEvent;
            state.selectedContact.events[eventIndex] = updatedContactEvent;
          }
        }
      },
    );

    builder.addMatcher(
      contactAPI.endpoints.removeContactEvent.matchPending,
      (state) => {
        state.loading = 'pending';
      },
    );
    builder.addMatcher(
      contactAPI.endpoints.removeContactEvent.matchFulfilled,
      (
        state,
        action: PayloadAction<{ contactID: number; eventID: number }>,
      ) => {
        state.loading = 'fulfilled';
        const contactIndex = state.contacts.findIndex(
          (contact) => contact.id == action.payload.contactID,
        );

        if (contactIndex !== -1 && state.selectedContact !== null) {
          const updatedContactEvents = state.contacts[
            contactIndex
          ].events.filter((event) => event.event_id !== action.payload.eventID);
          state.contacts[contactIndex].events = updatedContactEvents;
          state.selectedContact.events = updatedContactEvents;
        }
      },
    );
  },
});

export const selectedContacts = (state: RootState) =>
  state.contactReducer.contacts;

export const { clearContactState, selectContact } = contactSlice.actions;
export default contactSlice.reducer;
