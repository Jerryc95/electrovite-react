import React, { useState } from 'react';
import { Contact } from 'src/models/contact';
import { useUpdateContactMutation } from '../../../../services/contactAPI';

interface EditContactNameProps {
  contact: Contact;
  setShowingEditName: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditContactName: React.FC<EditContactNameProps> = ({
  contact,
  setShowingEditName,
}) => {
  const [firstName, setFirstName] = useState(contact.first_name);
  const [lastName, setLastName] = useState(contact.last_name);

  const [updateContact] = useUpdateContactMutation();

  const handleUpdateContact = () => {
    const updatedContact: Contact = {
      ...contact,
      first_name: firstName,
      last_name: lastName,
    };
    updateContact(updatedContact);
    setShowingEditName(false)
  };

  return (
    <div className='new-contact-container'>
      <div className='new-contact-form' style={{ width: '55%', height: '45%' }}>
        <div className='new-contact-heading'>
          <h2>Update Contact Name</h2>
          <button onClick={() => setShowingEditName(false)}>Cancel</button>
        </div>
        <div className='new-contact-details'>
          <label className='new-contact-label'>
            First Name
            <input
              className='new-contact-input'
              value={firstName}
              type='text'
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label className='new-contact-label'>
            Last Name
            <input
              className='new-contact-input'
              value={lastName}
              type='text'
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
        </div>
        <div className='new-contact-create-button'>
          <button onClick={handleUpdateContact}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default EditContactName;
