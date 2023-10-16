import React from 'react';
import { Contact } from 'src/models/contact';

import "../../../styles/contacts.scss"

interface ContactDetailProps {
  contact: Contact;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ contact }) => {

    // const formatStatus = () => {
    //     return ""
    // }

    const dateParser = (date: Date) => {
        return new Date(date)
    }

  return (
    <div className='contact-row-container'>
      <p className='contact-name'>{contact.first_name} {contact.last_name}</p>
      <p className='contact-email'>{contact.email ? contact.email : "N/A"}</p>
      <p className='contact-number'>{contact.phone ? contact.phone : "N/A"}</p>
      <p className='contact-last-contact'>{contact.last_contact_date ? dateParser(contact.last_contact_date).toLocaleDateString() : "N/A"}</p>
      <p className='contact-next-contact'>{contact.next_contact_date ? dateParser(contact.next_contact_date).toLocaleDateString() : "N/A"}</p>
      <p className='contact-status'>{dateParser(contact.creation_date).toLocaleDateString()}</p>
    </div>
  );
};

export default ContactDetail;
