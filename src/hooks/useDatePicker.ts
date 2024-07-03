import { useState, SyntheticEvent } from 'react';

export const useDatePicker = (initialValue: Date | null) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(initialValue);

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
