import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Contact } from 'src/models/contact';
import { RootState } from '../../services/store';
import ContactRow from '$renderer/components/dashboard/contacts/ContactRow';
import ContactRowLabel from '$renderer/components/dashboard/contacts/ContactRowLabel';
import NewContact from '$renderer/components/dashboard/contacts/NewContact';
import ContactDetail from '$renderer/components/dashboard/contacts/ContactDetail';
import '../styles/contacts.scss';
import { ContactEvent } from 'src/models/contactEvent';
import UpcomingEventView from '$renderer/components/dashboard/contacts/events/UpcomingEventView';

interface UpcomingEvent {
  contact: Contact;
  event: ContactEvent;
}

const Contacts: React.FC = () => {
  const [sortingOption, setSortingOption] = useState('firstName');
  const [addingContact, setAddingContact] = useState(false);
  const [showingContact, setShowingContact] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

  const accountState = useSelector((state: RootState) => state.accountReducer);

  const sortingOptions = [
    { value: 'firstName', display: 'First Name' },
    { value: 'lastName', display: 'Last Name' },
    { value: 'created', display: 'Date Added' },
    { value: 'lastContactDate', display: 'Last Contacted' },
    { value: 'nextContactDate', display: 'Next Contact' },
  ];

  const toggleContact = (contact: Contact) => {
    setSelectedContact(contact);
    setShowingContact(!showingContact);
  };

  const dateParser = (date: Date) => {
    return new Date(date);
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    if (sortingOption === 'firstName') {
      return a.first_name.localeCompare(b.first_name);
    } else if (sortingOption === 'lastName') {
      return a.last_name.localeCompare(b.last_name);
    } else if (sortingOption === 'created') {
      return (
        dateParser(b.creation_date).getTime() -
        dateParser(a.creation_date).getTime()
      );
    } else if (sortingOption === 'lastContactDate') {
      if (a.last_contact_date === null && b.last_contact_date === null) {
        return 0;
      }
      if (a.last_contact_date === null) {
        return 1;
      }
      if (b.last_contact_date === null) {
        return -1;
      }
      return (
        dateParser(a.last_contact_date).getTime() -
        dateParser(b.last_contact_date).getTime()
      );
    } else if (sortingOption === 'nextContactDate') {
      if (a.next_contact_date === null && b.next_contact_date === null) {
        return 0;
      }
      if (a.next_contact_date === null) {
        return 1;
      }
      if (b.next_contact_date === null) {
        return -1;
      }
      return (
        dateParser(a.next_contact_date).getTime() -
        dateParser(b.next_contact_date).getTime()
      );
    }
    return 0;
  });

  useEffect(() => {
    if (accountState) {
      const url = `http://localhost:3000/contacts?id=${accountState.account?.id}`;
      const today = new Date();
      const upcomingEventsArray: UpcomingEvent[] = [];
      fetch(url)
        .then((response) => response.json())
        .then((data: Contact[]) => {
          setContacts(data);
          data.forEach((contact) => {
            if (contact.events.length !== 0) {
              contact.events.forEach((event) => {
                if (dateParser(event.event_date) > today) {
                  const upcomingEvent: UpcomingEvent = {
                    contact: contact,
                    event: event,
                  };
                  upcomingEventsArray.push(upcomingEvent);
                }
              });
            }
          });

          const sortedUpcomingEvents = upcomingEventsArray.sort((a, b) => {
            const dateA = dateParser(a.event.event_date);
            const dateB = dateParser(b.event.event_date);
            if (dateA.getTime() < dateB.getTime()) {
              return -1;
            }
            if (dateA.getTime() > dateB.getTime()) {
              return 1;
            }
            return 0;
          });
          setUpcomingEvents(sortedUpcomingEvents.splice(0, 4));
        });
    }
  }, []);

  return (
    <div className='contacts-container'>
      <div className='contacts-header'>
        <h2>Contacts</h2>
        <button onClick={() => setAddingContact(!addingContact)}>
          Add Contact
        </button>
      </div>
      <div className='contacts-top-container'>
        <div className='contacts-upcoming-events'>
          <h3>Upcoming Events</h3>
          {upcomingEvents.length === 0 ? (
            <p>Next upcoming contact events will appear here</p>
          ) : (
            <div className='contacts-upcoming-event'>
              {upcomingEvents.map((upcomingEvent) => (
                <UpcomingEventView
                  key={upcomingEvent.event.event_id}
                  upcomingEvent={upcomingEvent}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className='contacts-bottom-container'>
        <div className='contacts-sorting-options'>
          {sortingOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => setSortingOption(option.value)}
              className={`sort-capsule ${option.value} ${
                sortingOption === option.value ? 'selected' : ''
              }`}
            >
              {option.display}
            </div>
          ))}
        </div>
        {sortedContacts.length === 0 ? (
          <p>Contacts will appear here</p>
        ) : (
          <div className='contacts-rows'>
            <ContactRowLabel key={'1'} />
            {sortedContacts.map((contact) => (
              <div
                key={contact.id}
                className='contact-row-item'
                onClick={() => toggleContact(contact)}
              >
                <ContactRow key={contact.id} contact={contact} />
              </div>
            ))}
          </div>
        )}
      </div>
      {addingContact && (
        <NewContact
          setAddingContact={setAddingContact}
          addingContact={addingContact}
          id={accountState.account?.id}
          setContacts={setContacts}
          contacts={contacts}
        />
      )}

      {showingContact && (
        <ContactDetail
          key={selectedContact.id}
          setContacts={setContacts}
          contact={selectedContact}
          setShowingContact={setShowingContact}
        />
      )}
    </div>
  );
};

export default Contacts;
