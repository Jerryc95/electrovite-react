import React, { useEffect, useState } from 'react';
import EditField from '$renderer/components/EditField';
import { Contact } from 'src/models/contact';

interface ContactNotesProp {
  contact: Contact;
}

const ContactNotes: React.FC<ContactNotesProp> = ({ contact }) => {
  const [notes, setNotes] = useState(contact.notes);

  useEffect(() => {
    const url = `http://localhost:3000/contacts/${contact.id}`;

    fetch(url)
      .then((response) => response.json())
      .then(async (data: Contact) => {
        await Promise.all([setNotes(data.notes)]);
      });
  });

  return (
    <div>
      <div>
        <EditField
          label=''
          field='notes'
          value={notes}
          id={contact.id}
          isInput={false}
          baseURL='http://localhost:3000/contacts/update/'
        />
      </div>
    </div>
  );
};

export default ContactNotes;
