import React from 'react';
import { useEditField } from '../../hooks/useEditField';
import '../styles/EditField.scss';

// Label is the field's label that is located above the input or text box
// field is item that is being sent as a part of the req.body to the api
// value is the data being shown
// id is the item's ID to find it in the DB
// isInput determines if the field should be an input or textarea.

interface EditFieldProps {
  label: string;
  field: string;
  value: string | null;
  id: number;
  isInput: boolean;
  baseURL: string
}

const EditField: React.FC<EditFieldProps> = ({
  label,
  field,
  value,
  id,
  isInput,
  baseURL,
}) => {
  const {
    isEditing,
    editedValue,
    handleEditClick,
    handleSaveClick,
    handleInputChange,
  } = useEditField(value);

  const displayLineBreaks = (text: string | null) => {
    if (text) {
      const lineBreakText = text.replace(/\n/g, '<br />')
      return <p dangerouslySetInnerHTML={{ __html: lineBreakText }} />
    }
  }

  return (
    <div className='edit-field-section'>
      <p className='edit-field-label'>{label}</p>
      {isEditing ? (
        <div className='edit-field-container'>
          {isInput ? (
            <input
              className='edit-field-input'
              type='text'
              value={editedValue ? editedValue : ''}
              onChange={handleInputChange}
            />
          ) : (
            <textarea
            className='edit-field-textarea'
            value={editedValue ? editedValue : ''}
            onChange={handleInputChange}
            />
          )}

          <button
            className='edit-field-button'
            onClick={() => {
              handleSaveClick(id, field, baseURL);
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
        <div
          className={`edit-field-content ${field}`}
          onClick={handleEditClick}
          style={{ cursor: 'pointer' }}
        >
          {displayLineBreaks(editedValue) || `Add ${label.slice(0, -1)}`}
        </div>
      )}
    </div>
  );
};

export default EditField;
