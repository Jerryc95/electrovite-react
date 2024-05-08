import React, { useState } from 'react';

import { Contact } from 'src/models/contact';
import { useAddContactMutation } from '../../../../services/contactAPI';

interface NewContactProps {
  setAddingContact: React.Dispatch<React.SetStateAction<boolean>>;
  id: number | undefined;
}

const NewContact: React.FC<NewContactProps> = ({ setAddingContact, id }) => {
  const [addContact] = useAddContactMutation();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');

  const handleAddContact = async () => {
    const newContact = {
      id: id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      number: number,
    };
    addContact(newContact);
    setAddingContact(false)
  };

  return (
    <div className='new-contact-container'>
      <div className='new-contact-form'>
        <div className='new-contact-heading'>
          <h2>Adding New Contact</h2>
          <button onClick={() => setAddingContact(false)}>Cancel</button>
        </div>
        <div className='new-contact-details'>
          <div className='new-contact-section'>
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
          <div className='new-contact-section'>
            <label className='new-contact-label'>
              Email
              <input
                className='new-contact-input'
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className='new-contact-label'>
              Phone Number
              <input
                className='new-contact-input'
                type='text'
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </label>
          </div>
        </div>
        <p>Email and Phone Number are optional and can be added later.</p>
        <div className='new-contact-create-button'>
          <button onClick={handleAddContact}>Add Contact</button>
        </div>
      </div>
    </div>
  );
};

export default NewContact;
