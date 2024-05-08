import { useState, ChangeEvent } from 'react';

export const useEditField = (initialValue: string | null) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(initialValue);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setEditedValue(initialValue);
  };

  const handleSaveClick = async (
    field: string,
    item: any,
    onEdit: (data: any) => Promise<void>,
  ) => {
    const updatedItem = { ...item };
    // const data = {
    //   [field]: editedValue,
    // };
    console.log(updatedItem);
    for (const key in updatedItem) {
      if (key == field) {
        updatedItem[field] = editedValue;
      }
    }

    console.log(updatedItem);
    onEdit(updatedItem);
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
