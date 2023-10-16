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
    id: number,
    field: string,
    baseURL: string,
  ) => {
    const url = `${baseURL}${id}`;
    const data = {
      [field]: editedValue,
    };
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error('Failed to update value');
      }
    } catch (error) {
      console.log(error);
    }
    if(typeof editedValue === 'number') {
        setPaidAmount(editedValue.toString())
        const updatedOutstandingValue = parseFloat(totalAmount) - editedValue

        setOutstandingAmount(updatedOutstandingValue.toString())
    }
    
    setIsEditing(false);
  };

  //   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
  //     setEditedValue(e.target.value);
  //   };
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
