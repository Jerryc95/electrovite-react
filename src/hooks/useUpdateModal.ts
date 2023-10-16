import { useState, ChangeEvent } from 'react';
import { Contact } from 'src/models/contact';

interface UpdateData {
    updateData: Contact
  }

export const useUpdateModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [dataToUpdate, setDataToUpdate] = useState<UpdateData | null>(null);

  const openModal = (initialData: UpdateData) => {
    setIsOpen(true);
    setDataToUpdate(initialData);
  };

  const closeModal = () => {
    setIsOpen(false);
    setDataToUpdate(null);
  };

  const handleOptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleSubmit = (updateData: (data: UpdateData) => void) => {
    // api logic here
    if(dataToUpdate) {
        updateData(dataToUpdate);
    }
    closeModal();
  };

  return {
    isOpen,
    openModal,
    closeModal,
    selectedOption,
    handleOptionChange,
    handleSubmit,
  };
};
