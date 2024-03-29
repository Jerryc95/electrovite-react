import React, { useEffect, useState } from 'react';
import { Contact } from 'src/models/contact';

interface NewClientsBoxProps {
  contacts: Contact[];
}

const NewClientsBox: React.FC<NewClientsBoxProps> = ({ contacts }) => {
  const [percentChange, setPercentChange] = useState(0);

  useEffect(() => {
    console.log(contacts);
  }, [contacts]);

  return (
    <div className='client-overview-container'>
      <div className='overview-row'>
        <h4>New Clients: {contacts.length}</h4>
        <div
          className={`client-overview-percent-container ${
            percentChange >= 0 ? 'positive' : 'negative'
          }`}
        >
          <p>
            {percentChange >= 0 ? '+' : ''}
            {percentChange}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewClientsBox;
