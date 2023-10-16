import React from 'react';
import { BKEntry } from 'src/models/BKEntry';

interface BKEntryRowProps {
  entry: BKEntry;
}

const BKEntryRow: React.FC<BKEntryRowProps> = ({ entry }) => {
  const dateParser = (date: Date) => {
    return new Date(date);
  };
  return (
    <div className='bookkeeping-entry-row-container'>
      <p className='bookkeeping-entry-name'>{entry.entry_name}</p>
      <p className={`bookkeeping-entry-total ${entry.transaction_type}`}>${entry.total_amount}</p>
      <p className='bookkeeping-entry-type'>{entry.transaction_type}</p>
      <p className='bookkeeping-entry-category'>{entry.category}</p>
    <p className='bookkeeping-entry-contact'>{entry.first_name} {entry.last_name}</p>
      <p className='bookkeeping-entry-date'>{dateParser(entry.entry_date).toLocaleDateString()}</p>
    </div>
  );
};

export default BKEntryRow;
