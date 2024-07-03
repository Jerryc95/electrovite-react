import { useState } from 'react';
import {
  CurrencyInputProps,
  CurrencyInputOnChangeValues,
} from 'react-currency-input-field/dist/components/CurrencyInputProps';

export const useCurrencyField = (
  initialValue: number | string | null,
  totalAmount: string,
  setPaidAmount: React.Dispatch<React.SetStateAction<string>>,
  setOutstandingAmount: React.Dispatch<React.SetStateAction<string>>,
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(initialValue);
  const [currencyValues, setCurrencyValues] =
    useState<CurrencyInputOnChangeValues>();

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = async (
    field: string,
    item: any,
    onEdit: (data: any) => Promise<void>,
  ) => {
 
    const updatedItem = { ...item };
    for (const key in updatedItem) {
      if (key == field) {
        updatedItem[field] = editedValue;
        
      }
    }
    onEdit(updatedItem);
    if(typeof editedValue === 'number') {
        setPaidAmount(editedValue.toString())
        const updatedOutstandingValue = parseFloat(totalAmount) - editedValue

        setOutstandingAmount(updatedOutstandingValue.toString())
    }
    
    setIsEditing(false);
  };

  const handleInputChange: CurrencyInputProps['onValueChange'] = (
    amount,
    _,
    values,
  ): void => {
    setCurrencyValues(values);
    if (Number.isNaN(Number(amount))) {
      return;
    }
    if (currencyValues) {
      setEditedValue(currencyValues.float);
    }
  };

  return {
    isEditing,
    editedValue,
    handleEditClick,
    handleSaveClick,
    handleInputChange,
  };
};
