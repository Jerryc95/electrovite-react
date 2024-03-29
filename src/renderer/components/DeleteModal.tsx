import React from 'react';

import '../styles/modal.scss';

interface DeleteModalProps {
  onDelete: () => void;
  setShowingModal: React.Dispatch<React.SetStateAction<boolean>>;
  item: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  onDelete,
  setShowingModal,
  item,
}) => {
  const handleDelete = () => {
    onDelete();
    setShowingModal(false);
  };

  const handleCancel = () => {
    setShowingModal(false);
  };

  return (
    <div className='modal-container'>
      <div className='modal-content'>
        <h3>{`Are you sure you want to delete this ${item}?`}</h3>
        <div className='button-row'>
          <button className='button-brand-dark-blue' onClick={handleCancel}>
            Cancel
          </button>
          <button className='button-brand-pink' onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
