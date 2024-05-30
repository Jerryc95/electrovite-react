import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Contact } from 'src/models/contact';
// import { RootState } from '../../services/store';
import ContactRow from '$renderer/components/dashboard/contacts/ContactRow';
import ContactRowLabel from '$renderer/components/dashboard/contacts/ContactRowLabel';
import NewContact from '$renderer/components/dashboard/contacts/NewContact';
// import ContactDetail from '$renderer/components/dashboard/contacts/ContactDetail';
import '../styles/contacts.scss';
import { ContactEvent } from 'src/models/contactEvent';
import UpcomingEventView from '$renderer/components/dashboard/contacts/events/UpcomingEventView';
import { getUser } from '../../services/accountSlice';

import { useFetchContactsQuery } from '../../services/contactAPI';
import { selectContact, getContacts } from '../../services/contactSlice';

interface UpcomingEvent {
  contact: Contact;
  event: ContactEvent;
}

const Contacts: React.FC = () => {
  const user = useSelector(getUser);
  const contacts = useSelector(getContacts);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sortingOption, setSortingOption] = useState('firstName');
  const [addingContact, setAddingContact] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);

  const fetchContacts = useFetchContactsQuery(user.account?.id, {
    refetchOnMountOrArgChange: true,
  });

  const sortingOptions = [
    { value: 'firstName', display: 'First Name' },
    { value: 'lastName', display: 'Last Name' },
    { value: 'created', display: 'Date Added' },
    { value: 'lastContactDate', display: 'Last Contacted' },
    { value: 'nextContactDate', display: 'Next Contact' },
  ];

  const toggleContact = (contact: Contact) => {
    dispatch(selectContact(contact));
    navigate(
      `/contacts/${contact.first_name.replaceAll(
        ' ',
        '-',
      )}-${contact.last_name.replaceAll(' ', '-')}`,
    );
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
    fetchContacts;
  }, []);

  useEffect(() => {
    const today = new Date();
    const upcomingEventsArray: UpcomingEvent[] = [];
    contacts.forEach((contact) => {
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
  }, [contacts]);

  return (
    <div className='contacts-container'>
      <div className='contacts-header'>
        <h2>Contacts</h2>
        <button onClick={() => setAddingContact(true)}>
          Add Contact
        </button>
      </div>
      <div className='contacts-top-container'>
        <div className='contacts-upcoming-events'>
          <h3>Upcoming Events</h3>
          {upcomingEvents.length === 0 ? (
            <p className='info-text'>
              Next upcoming contact events will appear here
            </p>
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
          <p className='info-text'>Contacts will appear here</p>
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
          // addingContact={addingContact}
          id={user.account?.id}
          // setContacts={setContacts}
          // contacts={contacts}
        />
      )}
    </div>
  );
};

export default Contacts;
