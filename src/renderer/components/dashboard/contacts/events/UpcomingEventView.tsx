import React from 'react';
import { Contact } from 'src/models/contact';
import { ContactEvent } from 'src/models/contactEvent';

interface UpcomingEvent {
    contact: Contact;
    event: ContactEvent;
}

interface UpcomingEventViewProps {
    upcomingEvent: UpcomingEvent;
}
const dateParser = (date: Date) => {
    return new Date(date);
  };

const UpcomingEventView: React.FC<UpcomingEventViewProps> = ({upcomingEvent}) => {
  return (
    <div className='contact-event-container'>
        <h5>{upcomingEvent.contact.first_name} {upcomingEvent.contact.last_name}</h5>
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
          {dateParser(upcomingEvent.event.event_date).toLocaleDateString()}
        </p>
        <p className='contact-event-time'></p>
      </div>
      <p className='contact-event-desciption'>{upcomingEvent.event.description}</p>
    </div>
  );
};

export default UpcomingEventView;