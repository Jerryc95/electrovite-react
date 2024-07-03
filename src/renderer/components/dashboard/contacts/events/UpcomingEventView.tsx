import React from 'react';

import { Contact } from 'src/models/contact';
import { ContactEvent } from 'src/models/contactEvent';
import { parseDate } from '../../../../../helpers/ParseDate';
import useToggleContact from '../../../../../hooks/useToggleContact';

interface UpcomingEvent {
  contact: Contact;
  event: ContactEvent;
}

interface UpcomingEventViewProps {
  upcomingEvent: UpcomingEvent;
}

const UpcomingEventView: React.FC<UpcomingEventViewProps> = ({
  upcomingEvent,
}) => {
  const toggleContact = useToggleContact();

  return (
    <div
      className='contact-event-container hoverable'
      onClick={() => toggleContact(upcomingEvent.contact)}
    >
      <div>
        <h5>
          {upcomingEvent.contact.first_name} {upcomingEvent.contact.last_name}
        </h5>
        <div className='contact-event-header'>
          <h4>{upcomingEvent.event.title}</h4>
          <p
            className={`contact-event-type ${upcomingEvent.event.event_type.replace(
              /\s+/g,
              '-',
            )}`}
          >
            {upcomingEvent.event.event_type}
          </p>
        </div>
        <div className='contact-event-info'>
          <p className='contact-event-date'>
            {parseDate(upcomingEvent.event.event_date).toLocaleDateString()}
          </p>
          <p className='contact-event-time'></p>
        </div>
        <p className='contact-event-description'>
          {upcomingEvent.event.description}
        </p>
      </div>
    </div>
  );
};

export default UpcomingEventView;
