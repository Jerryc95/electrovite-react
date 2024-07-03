import React from 'react';
import { Contact } from 'src/models/contact';

import "../../../styles/contacts.scss"
import { parseDate } from '../../../../helpers/ParseDate';

interface ContactDetailProps {
  contact: Contact;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ contact }) => {

  return (
    <div className='contact-row-container'>
      <p className='contact-name'>{contact.first_name} {contact.last_name}</p>
      <p className='contact-email'>{contact.email ? contact.email : "N/A"}</p>
      <p className='contact-number'>{contact.phone ? contact.phone : "N/A"}</p>
      <p className='contact-last-contact'>{contact.last_contact_date ? parseDate(contact.last_contact_date).toLocaleDateString() : "N/A"}</p>
      <p className='contact-next-contact'>{contact.next_contact_date ? parseDate(contact.next_contact_date).toLocaleDateString() : "N/A"}</p>
      <p className='contact-status'>{parseDate(contact.creation_date).toLocaleDateString()}</p>
    </div>
  );
};

export default ContactDetail;
