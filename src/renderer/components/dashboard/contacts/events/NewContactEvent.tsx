import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import { Contact } from 'src/models/contact';
import { ContactEvent } from 'src/models/contactEvent';

interface NewContactActivityProps {
  setAddingEvent: React.Dispatch<React.SetStateAction<boolean>>;
  addingEvent: boolean;
  contact: Contact;
  setSortedEvents: React.Dispatch<React.SetStateAction<ContactEvent[]>>
}

const NewContactEvent: React.FC<NewContactActivityProps> = ({
  setAddingEvent,
  addingEvent,
  contact,
  setSortedEvents
  
}) => {
  const today = new Date();
  const nextWeek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7,
  );

  const eventTypes = ['Meeting', 'Email', 'Call', 'Follow Up', 'Other'];

  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState(eventTypes[0]);
  const [eventDate, setEventDate] = useState<Date | null>(nextWeek);
  const [description, setDescription] = useState('');

  const handleDropDownSelection = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedType = event.target.value;
    setEventType(selectedType);
  };


  const handleCreateContactEvent = async () => {
    const url = 'http://localhost:3000/contacts/add/event';
    const newEvent = {
      title: title,
      id: contact.id,
      eventDate: eventDate,
      eventType: eventType,
      description: description,
    };
    console.log(newEvent)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });
      const responseData: ContactEvent = await response.json();

      setSortedEvents((events) => [...events, responseData])
      setAddingEvent(!addingEvent)
      console.log('response data:',responseData)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className='new-project-container'>
      <div className='new-project-form'>
        <div className='new-project-heading'>
          <h2>Adding New Event</h2>
          <button onClick={() => setAddingEvent(!addingEvent)}>Cancel</button>
        </div>
        <div className='new-project-details'>
          <div className='new-project-info'>
            <label className='new-project-label'>
              Event Name
              <input
                className='new-project-name-input'
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className='new-project-label'>
              Description
              <textarea
                className='new-project-description-input'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <span> {`${description.length} / 75 Characters`}</span>
            </label>
          </div>
          <div className='new-project-date-picker'>
            <h3>Event Date</h3>
            <DatePicker
              showIcon
              selected={eventDate}
              onChange={(date) => setEventDate(date)}
              timeInputLabel='Time:'
              showTimeInput
              dateFormat="MM/dd/yyyy h:mm aa"
              className='new-project-date-input'
              startDate={eventDate}
            />
            <h3>Event Type</h3>
            <select
              className='new-project-dropdown'
              value={eventType}
              onChange={handleDropDownSelection}
            >
              {eventTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className='new-project-create-button'>
          <button onClick={handleCreateContactEvent}>Add Event</button>
        </div>
      </div>
    </div>
  );
};

export default NewContactEvent;
