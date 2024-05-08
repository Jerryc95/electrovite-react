import React, { useState, useEffect } from 'react';

import { BKEntry } from 'src/models/BKEntry';
import { Contact } from 'src/models/contact';
import BKEntryRowLabel from '../../bookkeeping/BKEntryRowLabel';
import BKEntryRow from '../../bookkeeping/BKEntryRow';

interface ContactBKProps {
  contact: Contact;
}

const ContactBK: React.FC<ContactBKProps> = ({ contact }) => {
  const [entries, setEntries] = useState<BKEntry[]>([]);
  useEffect(() => {
    const url = `http://localhost:3000/bookkeeping/contact?accountID=${contact.account_id}&contactID=${contact.id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data: BKEntry[]) => {
        setEntries(data);
      });
  }, [contact.account_id, contact.id]);

  return (
    <div>
      <BKEntryRowLabel />
      <div>
        {entries.length === 0 ? (
          <div className='bk-contacts-empty'>
            <p>Connected Entries will appear here.</p>
          </div>
        ) : (
          <div>
            {entries.map((entry, index) => (
              <BKEntryRow key={index} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactBK;
