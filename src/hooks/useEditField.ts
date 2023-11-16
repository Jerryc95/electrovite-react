import { useState, ChangeEvent } from 'react';

export const useEditField = (initialValue: string | null) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(initialValue);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setEditedValue(initialValue);
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
      if (!response.ok) {
        throw new Error('Failed to update value');
      }
    } catch (error) {
      console.log(error);
    }
    setIsEditing(false);
  };

  const handleInputChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setEditedValue(e.target.value);
  };


  return {
    isEditing,
    editedValue,
    handleEditClick,
    handleSaveClick,
    handleInputChange,
  };
};
