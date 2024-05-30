import React, { useCallback, useEffect, useState } from 'react';
import { parseDate } from '../../../../helpers/ParseDate';
import { Contact } from '../../../../models/contact';

interface NewClientsBoxProps {
  id: number | undefined;
  // contacts: Contact[];
}

interface IContactAdded {
  id: number;
  creation_date: Date;
}

const NewClientsBox: React.FC<NewClientsBoxProps> = ({ id }) => {
  const [contactCount, setContactCount] = useState(0);
  const [percentChange, setPercentChange] = useState(0);

  const getContacts = useCallback(() => {
    const today = new Date();
    const url = `http://localhost:3000/home/contacts/${id}`;
    fetch(url)
      .then((response) => response.json())
      .then((data: IContactAdded[]) => {
        let newContacts = 0;

        for (const contact of data) {
          const timeDifference =
            today.getTime() - parseDate(contact.creation_date).getTime();
          const dayDifference = Math.floor(
            timeDifference / (1000 * 60 * 60 * 24),
          );
          if (dayDifference <= 30) {
            newContacts += 1;
          }
        }
        if (data.length != 0) {
          setPercentChange((newContacts / data.length) * 100);
        } else {
          setPercentChange(0);
        }
        setContactCount(newContacts);
      });
  }, [id]);

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  return (
    <div className='client-overview-container'>
      <div className='overview-row'>
        <h4>New Clients: {contactCount}</h4>
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
