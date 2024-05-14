import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { BKEntry } from 'src/models/BKEntry';
import { Contact } from 'src/models/contact';
import BKEntryRowLabel from '../../bookkeeping/BKEntryRowLabel';
import BKEntryRow from '../../bookkeeping/BKEntryRow';
import { setSelectedEntry } from '../../../../../services/bookkeepingSlice';

interface ContactBKProps {
  contact: Contact;
}

const ContactBK: React.FC<ContactBKProps> = ({ contact }) => {
  const [entries, setEntries] = useState<BKEntry[]>([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleEntry = (entry: BKEntry) => {
    dispatch(setSelectedEntry(entry));
    navigate(`/bookkeeping/${entry.entry_name.replaceAll(' ', '-')}`);
  };

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
            {entries.map((entry) => (
              <div
                key={entry.bookkeeping_id}
                onClick={() => toggleEntry(entry)}
              >
                <BKEntryRow entry={entry} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactBK;
