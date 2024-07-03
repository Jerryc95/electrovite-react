import React from 'react';
import EditField from '$renderer/components/EditField';
import { Contact } from 'src/models/contact';
import { useUpdateContactMutation } from '../../../../../services/contactAPI';

interface ContactNotesProp {
  contact: Contact;
}

const ContactNotes: React.FC<ContactNotesProp> = ({ contact }) => {
  const [updateContact] = useUpdateContactMutation();

  const handleUpdateContact = async (data: any) => {
    updateContact(data);
  };

  return (
    <div>
      <h3>Note</h3>
      <div>
        <EditField
          label=''
          field='notes'
          value={contact.notes}
          isInput={false}
          item={contact}
          onEdit={handleUpdateContact}
        />
      </div>
    </div>
  );
};

export default ContactNotes;
