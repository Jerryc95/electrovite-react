import React from 'react';
import DatePicker from 'react-datepicker';
import { useDatePicker } from '../../hooks/useDatePicker';

interface CalendarFieldProps {
  label: string;
  field: string;
  value: Date | null;
  item: any;
  onEdit: (data: any) => Promise<void>;
  // id: number;
  // baseURL: string;
}

const CalendarField: React.FC<CalendarFieldProps> = ({
  label,
  field,
  value,
  item,
  onEdit,
  // id,
  // baseURL,
}) => {
  const {
    isEditing,
    editedValue,
    handleEditClick,
    handleSaveClick,
    handleInputChange,
  } = useDatePicker(value);

  const dateParser = (date: Date) => {
    return new Date(date);
  };
  return (
    <div className='edit-field-section'>
      <p className='edit-field-label'>{label}</p>
      {isEditing ? (
        <div className='edit-field-container'>
          <DatePicker
            showIcon
            selected={editedValue ? dateParser(editedValue) : null}
            onChange={handleInputChange}
            dateFormat='MM/dd/yyyy'
            className='date-field-input'
            startDate={value}
          />
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
          className={`edit-field-content ${field}`}
          onClick={handleEditClick}
          style={{ cursor: 'pointer' }}
        >
            {editedValue ? dateParser(editedValue).toLocaleDateString() : `Add ${label.slice(0, -1)}`}
        </p>
      )}
    </div>
  );
};

export default CalendarField;
