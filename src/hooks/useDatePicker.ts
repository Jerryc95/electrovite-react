import { useState, SyntheticEvent } from 'react';

export const useDatePicker = (initialValue: Date | null) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(initialValue);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = async (id: number, field: string, baseURL: string) => {
    const url = `${baseURL}${id}`;

    const data = {
      [field]: editedValue,
    };
    console.log(url);
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
    setIsEditing(false);
  };

  const handleInputChange = (
    date: Date | null,
    e: SyntheticEvent<Event> | undefined,
  ) => {
    setEditedValue(date);
    console.log(date);
    console.log(e);
  };

  return {
    isEditing,
    editedValue,
    handleEditClick,
    handleSaveClick,
    handleInputChange,
  };
};
