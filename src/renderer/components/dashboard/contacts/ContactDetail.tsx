import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faGear } from '@fortawesome/free-solid-svg-icons';

import EditField from '$renderer/components/EditField';
import { RootState } from '../../../../services/store';
import { Contact } from 'src/models/contact';
import { ContactEvent } from 'src/models/contactEvent';
import NewContactEvent from './events/NewContactEvent';
import ContactEventView from './events/ContactEventView';
import DropdownField from '$renderer/components/DropdownField';
import { contactStatus } from '../../../../statuses/contactStatus';
import { proposalStatus } from '../../../../statuses/proposalStatus';
import { contractStatus } from '../../../../statuses/contractStatus';
import CalendarField from '$renderer/components/CalendarField';
import ContactBK from './componentPages/contactBK';
import ContactNotes from './componentPages/ContactNotes';

interface ContactDetailProps {
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  contact: Contact;
  setShowingContact: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContactDetail: React.FC<ContactDetailProps> = ({
  setContacts,
  contact,
  setShowingContact,
}) => {
  const accountState = useSelector((state: RootState) => state.accountReducer);
  const [selectedPage, setSelectedPage] = useState('Bookkeeping');
  const [addingEvent, setAddingEvent] = useState(false);
  const [sortedContactEvents, setSortedContactEvents] = useState<
    ContactEvent[]
  >([]);
  const pageOptions = ['Projects', 'Documents', 'Bookkeeping', 'Notes'];
  const [componentPage, setComponentPage] = useState<JSX.Element>(
    <ContactBK contact={contact} />,
  );

  const togglePage = (page: string) => {
    setSelectedPage(page);
    switch (page) {
      case 'Projects':
        setComponentPage(<ContactBK contact={contact}/>);
        break;
      case 'Documents':
        setComponentPage(<ContactBK contact={contact}/>);
        break;
      case 'Bookkeeping':
        setComponentPage(<ContactBK contact={contact}/>);
        break;
      case 'Notes':
        setComponentPage(<ContactNotes contact={contact}/>);
        break;
    }
  };

  const toggleContact = () => {
    if (accountState) {
      const url = `http://localhost:3000/contacts?id=${accountState.account?.id}`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setContacts(data);
        });
    }
    setShowingContact(false);
  };

  const dateParser = (date: Date) => {
    return new Date(date);
  };

  const handleSortContacts = () => {
    if (contact.events.length !== 0) {
      const today = new Date();

      const futureEvents = contact.events.filter((event) => {
        return dateParser(event.event_date).getTime() > today.getTime();
      });

      const sortedEvents = futureEvents.sort((a, b) => {
        return (
          dateParser(a.event_date).getTime() -
          dateParser(b.event_date).getTime()
        );
      });
      setSortedContactEvents(sortedEvents);
    }
  };

  useEffect(() => {
    handleSortContacts();
  }, []);

  return (
    <div className='contact-detail-container'>
      <div className='contact-detail-header'>
        <div className='contact-detail-header-leading'>
          <div className='contact-detail-back' onClick={toggleContact}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <p>Contacts</p>
          </div>
          <h2>
            {contact.first_name} {contact.last_name}
          </h2>
        </div>
        <div className='contact-detail-header-trailing'>
          <FontAwesomeIcon icon={faGear} className='' />
          <button onClick={() => setAddingEvent(true)}>Add Event</button>
        </div>
      </div>
      <div className='contact-detail-top-container'>
        <h3>Contact Info</h3>
        <div className='contact-detail-details'>
          <div className='contact-detail-details-column'>
            <EditField
              label='Phone Number:'
              field='phone'
              value={contact.phone}
              id={contact.id}
              isInput={true}
              baseURL='http://localhost:3000/contacts/update/'
            />
            <EditField
              label='Email:'
              field='email'
              value={contact.email}
              id={contact.id}
              isInput={true}
              baseURL='http://localhost:3000/contacts/update/'
            />
            <EditField
              label='Address:'
              field='address'
              value={contact.address}
              id={contact.id}
              isInput={true}
              baseURL='http://localhost:3000/contacts/update/'
            />
          </div>
          <div className='contact-detail-details-column'>
            <EditField
              label='Company:'
              field='company'
              value={contact.company}
              id={contact.id}
              isInput={true}
              baseURL='http://localhost:3000/contacts/update/'
            />
            <EditField
              label='Role:'
              field='role'
              value={contact.role}
              id={contact.id}
              isInput={true}
              baseURL='http://localhost:3000/contacts/update/'
            />
            <EditField
              label='Industry:'
              field='industry'
              value={contact.industry}
              id={contact.id}
              isInput={true}
              baseURL='http://localhost:3000/contacts/update/'
            />
          </div>
          <div className='contact-detail-details-column'>
            <div className='edit-field-section'>
              <p className='edit-field-label'>Date Added:</p>
              <p className='edit-field-content'>
                {dateParser(contact.creation_date).toLocaleDateString()}
              </p>
            </div>
            <CalendarField
              label='Last Contact:'
              field='lastContactDate'
              value={contact.last_contact_date}
              id={contact.id}
              baseURL='http://localhost:3000/contacts/update/'
            />
            <CalendarField
              label='Last Contact:'
              field='nextContactDate'
              value={contact.next_contact_date}
              id={contact.id}
              baseURL='http://localhost:3000/contacts/update/'
            />
          </div>
          <div className='contact-detail-details-column'>
            <DropdownField
              label='Contact Status:'
              field='contactStatus'
              value={contact.contact_status}
              id={contact.id}
              options={contactStatus}
              baseURL='http://localhost:3000/contacts/update/'
            />
            <DropdownField
              label='Proposal Status:'
              field='proposalStatus'
              value={contact.proposal_status}
              id={contact.id}
              options={proposalStatus}
              baseURL='http://localhost:3000/contacts/update/'
            />
            <DropdownField
              label='Contract Status:'
              field='contractStatus'
              value={contact.contract_status}
              id={contact.id}
              options={contractStatus}
              baseURL='http://localhost:3000/contacts/update/'
            />
          </div>
          <div className='contact-detail-details-column'>
            <CalendarField
              label='Birthday:'
              field='birthday'
              value={contact.birthday}
              id={contact.id}
              baseURL='http://localhost:3000/contacts/update/'
            />
            <EditField
              label='Website:'
              field='website'
              value={contact.website}
              id={contact.id}
              isInput={true}
              baseURL='http://localhost:3000/contacts/update/'
            />
            <EditField
              label='Social:'
              field='social'
              value={contact.social}
              id={contact.id}
              isInput={true}
              baseURL='http://localhost:3000/contacts/update/'
            />
          </div>
        </div>
      </div>
      <div className='contact-detail-bottom-container'>
        <div className='contact-detail-main'>
          <div className='contact-page-options'>
            {pageOptions.map((option) => (
              <div
                key={option}
                onClick={() => togglePage(option)}
                className={`sort-capsule ${option} ${
                  selectedPage === option ? 'selected' : ''
                }`}
              >
                {option}
              </div>
            ))}
          </div>
          <h3>{selectedPage}</h3>
          {componentPage}
        </div>
        <div
          className='contact-detail-activities'
          onClick={() => {
            console.log(sortedContactEvents);
          }}
        >
          <h3>Events</h3>
          {sortedContactEvents.length === 0 ? (
            <p>Added events will appear here</p>
          ) : (
            <div className='contact-detail-activity-column'>
              {sortedContactEvents.map((event) => (
                <ContactEventView key={event.event_id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
      {addingEvent && (
        <NewContactEvent
          setAddingEvent={setAddingEvent}
          addingEvent={addingEvent}
          contact={contact}
          setSortedEvents={setSortedContactEvents}
        />
      )}
    </div>
  );
};

export default ContactDetail;
