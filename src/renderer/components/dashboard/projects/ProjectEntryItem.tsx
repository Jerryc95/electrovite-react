import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';

import { BKEntry } from 'src/models/BKEntry';
import useToggleEntry from '../../../../hooks/useToggleEntry';
import { useUpdateEntryMutation } from '../../../../services/bookkeepingAPI';

interface ProjectEntryItemProps {
  entry: BKEntry;
  entries: BKEntry[];
  isEditing: boolean;
  setEntries: React.Dispatch<React.SetStateAction<BKEntry[]>>;
}

const ProjectEntryItem: React.FC<ProjectEntryItemProps> = ({
  entry,
  entries,
  isEditing,
  setEntries,
}) => {
  const toggleEntry = useToggleEntry();
  const [updateEntry] = useUpdateEntryMutation();

  const handleDisonnectEntry = async () => {
    const updatedEntry = { ...entry, project_id: null };
    const updatedEntries = entries.filter(
      (i) => i.bookkeeping_id !== entry.bookkeeping_id,
    );
    setEntries(updatedEntries);
    updateEntry(updatedEntry);
  };

  return (
    <div
      className='sidebar-entry-container hoverable'
      onClick={() => toggleEntry(entry)}
    >
      <div className='entry-row'>
        <h5 className='entry-name'>{entry.entry_name}</h5>
        <p className='entry-total'>{entry.category}</p>

        <FontAwesomeIcon
          icon={faMinusCircle}
          size='lg'
          className={
            isEditing ? 'remove-entry-button removing' : 'remove-entry-button'
          }
          onClick={(event) => {
            event.stopPropagation();
            handleDisonnectEntry();
          }}
        />
      </div>
      <div className='entry-row'>
        <p className='entry-total'>{entry.total_amount}</p>
        <p className={`${entry.transaction_type}`}>{entry.transaction_type}</p>
      </div>
    </div>
  );
};

export default ProjectEntryItem;
