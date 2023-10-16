import React from 'react';
import CurrencyInput from 'react-currency-input-field';

import { useCurrencyField } from '../../hooks/useCurrencyField';
import '../styles/EditField.scss';

// Label is the field's label that is located above the input or text box
// field is item that is being sent as a part of the req.body to the api
// value is the data being shown
// id is the item's ID to find it in the DB
// isInput determines if the field should be an input or textarea.

interface CurrencyFieldProps {
  label: string;
  field: string;
  value: string | null;
  id: number;
  baseURL: string;
  totalAmount: string;
  outstandingAmount: string;
  setPaidAmount: React.Dispatch<React.SetStateAction<string>>;
  setOutstandingAmount: React.Dispatch<React.SetStateAction<string>>;
}

const CurrencyField: React.FC<CurrencyFieldProps> = ({
  label,
  field,
  value,
  id,
  baseURL,
  totalAmount,
  setPaidAmount,
  setOutstandingAmount,
}) => {
  const {
    isEditing,
    editedValue,
    handleEditClick,
    handleSaveClick,
    handleInputChange,
  } = useCurrencyField(
    value,
    totalAmount,
    setPaidAmount,
    setOutstandingAmount,
  );
  return (
    <div className='edit-field-section'>
      <p className='edit-field-label'>{label}</p>
      {isEditing ? (
        <div className='edit-field-container'>
          <CurrencyInput
            className='edit-field-input'
            id='amount-input'
            name='amount-input'
            onValueChange={handleInputChange}
            decimalsLimit={2}
            prefix='$'
          />
          {/* <input
            className='edit-field-input'
            type='text'
            value={editedValue ? editedValue : ''}
            onChange={handleInputChange}
          /> */}

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
        <p
          className={`edit-field-content ${field}`}
          onClick={handleEditClick}
          style={{ cursor: 'pointer' }}
        >
          {editedValue !== null
            ? `$${editedValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}`
            : `Add ${label.slice(0, -1)}`}
        </p>
      )}
    </div>
  );
};

export default CurrencyField;
