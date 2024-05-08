import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import { ContactEvent } from 'src/models/contactEvent';
import EditContactEvent from './EditContactEvent';
import { parseDate } from '../../../../../helpers/ParseDate';

interface ContactEventProps {
  event: ContactEvent;
}

const ContactEventView: React.FC<ContactEventProps> = ({ event }) => {
  const [editingContactEvent, setEditingContactEvent] = useState(false);
 


  return (
    <div className='contact-event-container'>
      <div>
        <div className='contact-event-header'>
          <h4>{event.title}</h4>
          <p
            className={`contact-event-type ${event.event_type.replace(
              /\s+/g,
              '-',
            )}`}
          >
            {event.event_type}
          </p>
        </div>
        <div className='contact-event-info'>
          <p className='contact-event-date'>
            {parseDate(event.event_date).toLocaleDateString()}
          </p>
          <p className='contact-event-time'>
            {parseDate(event.event_date).toLocaleTimeString([], {
              hour12: true,
              hour: 'numeric',
              minute: '2-digit',
            })}
          </p>
        </div>
        <p className='contact-event-desciption'>{event.description}</p>
      </div>
      <div
        className='edit-event-icon-container'
        onClick={() => setEditingContactEvent(true)}
      >
        <FontAwesomeIcon className='edit-event-icon' icon={faPenToSquare} />
      </div>
      {editingContactEvent && (
        <EditContactEvent
          contactEvent={event}
          setEditingContactEvent={setEditingContactEvent}
        />
      )}
    </div>
  );
};

export default ContactEventView;
