import React from 'react';
import { useEditField } from '../../hooks/useEditField';
import { contactStatus } from 'src/statuses/contactStatus';
import { contractStatus } from 'src/statuses/contractStatus';
import { proposalStatus } from 'src/statuses/proposalStatus';
import { projectStatus } from 'src/statuses/projectStatus';
import { taskStatus } from 'src/statuses/taskStatus';
import { priorityStatus } from 'src/statuses/priorityStatus';

interface DropdownFieldProps {
  label: string;
  field: string;
  value: string;
  item: any;
  options:
    | typeof contactStatus
    | typeof contractStatus
    | typeof proposalStatus
    | typeof projectStatus
    | typeof taskStatus
    | typeof priorityStatus
    | string;
  onEdit: (data: any) => Promise<void>;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  field,
  value,
  item,
  options,
  onEdit,
}) => {
  const {
    isEditing,
    editedValue,
    handleEditClick,
    handleSaveClick,
    handleInputChange,
  } = useEditField(value);


  return (
    <div className='edit-field-section'>
      <p className='edit-field-label'>{label}</p>
      {isEditing ? (
        <div className='edit-field-container'>
          <select
            className='edit-field-input'
            value={editedValue ? editedValue : ''}
            onChange={handleInputChange}
          >
            {Object.values(options).map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <button
            className='edit-field-button'
            onClick={() => {
              handleSaveClick(field, item, onEdit);
            }}
          >
            Save
          </button>
          <button
            className='edit-field-cancel-button'
            onClick={handleEditClick}
          >
            Cancel
          </button>
        </div>
      ) : (
        <p
          className='edit-field-content'
          onClick={handleEditClick}
          style={{ cursor: 'pointer' }}
        >
          {editedValue || `Add ${label.slice(0, -1)}`}
        </p>
      )}
    </div>
  );
};

export default DropdownField;
