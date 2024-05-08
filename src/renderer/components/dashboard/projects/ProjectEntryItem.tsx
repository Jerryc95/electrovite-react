import React from 'react';
import { BKEntry } from 'src/models/BKEntry';

interface ProjectEntryItemProps {
  entry: BKEntry;
}

const ProjectEntryItem: React.FC<ProjectEntryItemProps> = ({ entry }) => {
  return (
    <div className='sidebar-entry-container'>
      <div className='entry-row'>
        <h5 className='entry-name'>{entry.entry_name}</h5>
        <p className='entry-total'>{entry.category}</p>
      </div>
      <div className='entry-row'>
        <p className='entry-total'>{entry.total_amount}</p>
        <p className={`${entry.transaction_type}`}>{entry.transaction_type}</p>
      </div>
    </div>
  );
};

export default ProjectEntryItem;
