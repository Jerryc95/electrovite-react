import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import useBackClick from '../../../../../hooks/useBackClick';
import { ContactEvent } from 'src/models/contactEvent';
import {
  useRemoveContactEventMutation,
  useUpdateContactEventMutation,
} from '../../../../../services/contactAPI';
import { parseDate } from '../../../../../helpers/ParseDate';
import DeleteModal from '$renderer/components/DeleteModal';

interface EditContactEventProps {
  contactEvent: ContactEvent;
  setEditingContactEvent: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditContactEvent: React.FC<EditContactEventProps> = ({
  contactEvent,
  setEditingContactEvent,
}) => {
  const goBack = useBackClick();
  const [updateContactEvent] = useUpdateContactEventMutation();
  const [removeContactEvent] = useRemoveContactEventMutation();

  const eventTypes = ['Meeting', 'Email', 'Call', 'Follow Up', 'Other'];

  const [title, setTitle] = useState(contactEvent.title);
  const [eventType, setEventType] = useState(contactEvent.event_type);
  const [eventDate, setEventDate] = useState<Date | null>(
    parseDate(contactEvent.event_date),
  );
  const [description, setDescription] = useState(contactEvent.description);
  const [showingDeleteAlert, setShowingDeleteAlert] = useState(false);

  const handleUpdateContactEvent = () => {
    if (eventDate !== null && eventDate !== undefined) {
      const updatedEvent: ContactEvent = {
        event_id: contactEvent.event_id,
        contact_id: contactEvent.contact_id,
        title: title,
        event_date: eventDate,
        event_type: eventType,
        description: description,
      };
      updateContactEvent(updatedEvent);
      setEditingContactEvent(false)
    }
  };

  const toggleDeleteContactEvent = () => {
    setShowingDeleteAlert(!showingDeleteAlert);
  };

  const handleDeleteContactEvent = () => {
    console.log(contactEvent)
    removeContactEvent(contactEvent);
    setEditingContactEvent(false)
    setShowingDeleteAlert(false);
  };

  const handleDropDownSelection = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedType = event.target.value;
    setEventType(selectedType);
  };

  return (
    // <div className='edit-project-container'>
    //   <div className='edit-project-form'>
    //     <div className='edit-project-heading'>
    //       <h2>Edit Event</h2>
    //       <button onClick={() => setEditingContactEvent(false)}>Cancel</button>
    //     </div>

    //   </div>
    // </div>
    <div className='new-project-container'>
      <div className='new-project-form'>
        <div className='new-project-heading'>
          <h2>Editing Event</h2>
          <button onClick={() => setEditingContactEvent(false)}>Cancel</button>
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
              dateFormat='MM/dd/yyyy h:mm aa'
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
          <button
            className='button-brand-lighter-blue'
            onClick={handleUpdateContactEvent}
          >
            Update
          </button>
          <button
            className='button-brand-pink'
            onClick={toggleDeleteContactEvent}
          >
            Delete
          </button>
        </div>
      </div>
      {showingDeleteAlert && (
        <DeleteModal
          onDelete={handleDeleteContactEvent}
          setShowingModal={toggleDeleteContactEvent}
          item='Event'
        />
      )}
    </div>
  );
};

export default EditContactEvent;
