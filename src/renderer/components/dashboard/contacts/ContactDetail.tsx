import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faTrash } from '@fortawesome/free-solid-svg-icons';

import EditField from '$renderer/components/EditField';
import { Contact } from 'src/models/contact';
import { ContactEvent } from 'src/models/contactEvent';
import NewContactEvent from './events/NewContactEvent';
import ContactEventView from './events/ContactEventView';
import DropdownField from '$renderer/components/DropdownField';
import { contactStatus } from '../../../../statuses/contactStatus';
import { proposalStatus } from '../../../../statuses/proposalStatus';
import { contractStatus } from '../../../../statuses/contractStatus';
import CalendarField from '$renderer/components/CalendarField';
import ContactBK from './componentPages/ContactBK';
import ContactNotes from './componentPages/ContactNotes';
import DeleteModal from '$renderer/components/DeleteModal';
import useBackClick from '../../../../hooks/useBackClick';
import {
  useUpdateContactMutation,
  useRemoveContactMutation,
} from '../../../../services/contactAPI';
import { parseDate } from '../../../../helpers/ParseDate';
import ContactProjects from './componentPages/ContactProjects';
import EditContactName from './EditContactName';

interface ContactDetailProps {
  contact: Contact;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ contact }) => {
  const goBack = useBackClick();
  const [selectedPage, setSelectedPage] = useState('Projects');
  const [showingDeleteContact, setShowingDeleteContact] = useState(false);
  const [addingEvent, setAddingEvent] = useState(false);
  const [sortedContactEvents, setSortedContactEvents] = useState<
    ContactEvent[]
  >([]);
  const [showingEditName, setShowingEditName] = useState(false);
  const pageOptions = ['Projects', 'Bookkeeping', 'Notes'];
  const [componentPage, setComponentPage] = useState<JSX.Element>(
    <ContactProjects contact={contact} />,
  );

  const [updateContact] = useUpdateContactMutation();
  const [deleteContact] = useRemoveContactMutation();

  const togglePage = (page: string) => {
    setSelectedPage(page);
    switch (page) {
      case 'Projects':
        setComponentPage(<ContactProjects contact={contact} />);
        break;
      // case 'Documents':
      //   setComponentPage(<ContactBK contact={contact} />);
      //   break;
      case 'Bookkeeping':
        setComponentPage(<ContactBK contact={contact} />);
        break;
      case 'Notes':
        setComponentPage(<ContactNotes contact={contact} />);
        break;
    }
  };

  const toggleContact = () => {
    goBack();
  };

  const handleSortContacts = useCallback(() => {
    if (contact.events.length !== 0) {
      const today = new Date();

      const futureEvents = contact.events.filter((event) => {
        return parseDate(event.event_date).getTime() > today.getTime();
      });

      const sortedEvents = futureEvents.sort((a, b) => {
        return (
          parseDate(a.event_date).getTime() - parseDate(b.event_date).getTime()
        );
      });
      setSortedContactEvents(sortedEvents);
    }
  }, [contact.events]);

  const handleUpdateContact = async (data: any) => {
    updateContact(data);
  };

  const handleDeleteContact = () => {
    deleteContact(contact);
    toggleContact();
  };

  useEffect(() => {
    handleSortContacts();
  }, [handleSortContacts]);

  return (
    <div className='contact-detail-container'>
      <div className='contact-detail-header'>
        <div className='contact-detail-header-leading'>
          <div className='contact-detail-back' onClick={toggleContact}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <p>Back</p>
          </div>
          <h2 onClick={() => setShowingEditName(true)}>
            {contact.first_name} {contact.last_name}
          </h2>
        </div>
        <div className='contact-detail-header-trailing'>
          <button onClick={() => setAddingEvent(true)}>Add Event</button>
          <FontAwesomeIcon
            icon={faTrash}
            className='delete-contact-button'
            onClick={() => setShowingDeleteContact(true)}
          />
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
              isInput={true}
              item={contact}
              onEdit={handleUpdateContact}
            />
            <EditField
              label='Email:'
              field='email'
              value={contact.email}
              isInput={true}
              item={contact}
              onEdit={handleUpdateContact}
            />
            <EditField
              label='Address:'
              field='address'
              value={contact.address}
              isInput={true}
              item={contact}
              onEdit={handleUpdateContact}
            />
          </div>
          <div className='contact-detail-details-column'>
            <EditField
              label='Company:'
              field='company'
              value={contact.company}
              isInput={true}
              item={contact}
              onEdit={handleUpdateContact}
            />
            <EditField
              label='Role:'
              field='role'
              value={contact.role}
              isInput={true}
              item={contact}
              onEdit={handleUpdateContact}
            />
            <EditField
              label='Industry:'
              field='industry'
              value={contact.industry}
              isInput={true}
              item={contact}
              onEdit={handleUpdateContact}
            />
          </div>
          <div className='contact-detail-details-column'>
            <div className='edit-field-section'>
              <p className='edit-field-label'>Date Added:</p>
              <p className='edit-field-content'>
                {parseDate(contact.creation_date).toLocaleDateString()}
              </p>
            </div>
            <CalendarField
              label='Last Contact:'
              field='last_contact_date'
              value={contact.last_contact_date}
              item={contact}
              onEdit={handleUpdateContact}
              // id={contact.id}
              // baseURL='http://localhost:3000/contacts/update/'
            />
            <CalendarField
              label='Next Contact:'
              field='next_contact_date'
              value={contact.next_contact_date}
              item={contact}
              onEdit={handleUpdateContact}
              // id={contact.id}
              // baseURL='http://localhost:3000/contacts/update/'
            />
          </div>
          <div className='contact-detail-details-column'>
            <DropdownField
              label='Contact Status:'
              field='contact_status'
              value={contact.contact_status}
              options={contactStatus}
              item={contact}
              onEdit={handleUpdateContact}
            />
            <DropdownField
              label='Proposal Status:'
              field='proposal_status'
              value={contact.proposal_status}
              options={proposalStatus}
              item={contact}
              onEdit={handleUpdateContact}
            />
            <DropdownField
              label='Contract Status:'
              field='contract_status'
              value={contact.contract_status}
              options={contractStatus}
              item={contact}
              onEdit={handleUpdateContact}
            />
          </div>
          <div className='contact-detail-details-column'>
            <CalendarField
              label='Birthday:'
              field='birthday'
              value={contact.birthday}
              item={contact}
              onEdit={handleUpdateContact}
              // id={contact.id}
              // baseURL='http://localhost:3000/contacts/update/'
            />
            <EditField
              label='Website:'
              field='website'
              value={contact.website}
              isInput={true}
              item={contact}
              onEdit={handleUpdateContact}
            />
            <EditField
              label='Social:'
              field='social'
              value={contact.social}
              isInput={true}
              item={contact}
              onEdit={handleUpdateContact}
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
          {/* <h3>{selectedPage}</h3> */}
          {componentPage}
        </div>
        <div className='contact-detail-activities'>
          <h3>Events</h3>
          {contact.events.length === 0 ? (
            <p className='info-text'>Added events will appear here</p>
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
        <NewContactEvent setAddingEvent={setAddingEvent} id={contact.id} />
      )}
      {showingDeleteContact && (
        <DeleteModal
          onDelete={handleDeleteContact}
          setShowingModal={setShowingDeleteContact}
          item='contact'
        />
      )}
      {showingEditName && (
        <EditContactName
          contact={contact}
          setShowingEditName={setShowingEditName}
        />
      )}
    </div>
  );
};

export default ContactDetail;
