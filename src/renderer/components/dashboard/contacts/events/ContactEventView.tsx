import React from 'react';
import { ContactEvent } from 'src/models/contactEvent';

interface ContactEventProps {
  event: ContactEvent;
}

const ContactEventView: React.FC<ContactEventProps> = ({ event }) => {
  const dateParser = (date: Date) => {
    return new Date(date);
  };


  return (
    <div className='contact-event-container'>
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
          {dateParser(event.event_date).toLocaleDateString()}
        </p>
        <p className='contact-event-time'>
          {dateParser(event.event_date).toLocaleTimeString([], {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit',
          })}
        </p>
      </div>
      <p className='contact-event-desciption'>{event.description}</p>
    </div>
  );
};

export default ContactEventView;
