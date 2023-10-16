import React, { useState } from 'react';

import { Contact } from 'src/models/contact';

interface NewContactProps {
  setAddingContact: React.Dispatch<React.SetStateAction<boolean>>;
  addingContact: boolean;
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  id: number | undefined
  contacts: Contact[];
}

const NewContact: React.FC<NewContactProps> = ({
  setAddingContact,
  addingContact,
  setContacts,
  id,
  contacts,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');

  const handleAddContact = async () => {
    const url = 'http://localhost:3000/contacts/add';
    const newContact = {
        id: id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        number: number,
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newContact),
          });
          const responseData: Contact = await response.json();
          console.log(responseData)
          const contact: Contact = {
            id: responseData.id,
            account_id: responseData.account_id,
            creation_date: responseData.creation_date,
            first_name: responseData.first_name,
            last_name: responseData.last_name,
            email: responseData.email,
            phone: responseData.phone,
            address: responseData.address,
            company: responseData.company,
            role: responseData.role,
            last_contact_date: responseData.last_contact_date,
            next_contact_date: responseData.next_contact_date,
            contact_status: responseData.contact_status,
            proposal_status: responseData.proposal_status,
            contract_status: responseData.contract_status,
            notes: responseData.notes,
            industry: responseData.industry,
            events: [],
            birthday: responseData.birthday,
            website: responseData.website,
            social: responseData.social,

          }
          setContacts((contacts) => [...contacts, contact])
          console.log(contacts)
          setAddingContact(!addingContact);
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <div className='new-contact-container'>
      <div className='new-contact-form'>
        <div className='new-contact-heading'>
          <h2>Adding New Contact</h2>
          <button onClick={() => setAddingContact(!addingContact)}>
            Cancel
          </button>
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
