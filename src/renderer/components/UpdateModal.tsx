import React, { useEffect, ChangeEvent } from 'react';

import '../styles/modal.scss';

interface BKClient {
  id: number;
  first_name: string;
  last_name: string;
}

interface UpdateModalProps {
  onSubmit: () => void;
  onLoad: () => void;
  setShowingModal: React.Dispatch<React.SetStateAction<boolean>>;
  item: string;
  data: BKClient[];
  setData: React.Dispatch<React.SetStateAction<BKClient | null>>;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  onSubmit,
  onLoad,
  setShowingModal,
  item,
  data,
  setData,
}) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const foundData = data.find(
      (i) => i.first_name + ' ' + i.last_name === e.target.value,
    );
    if (foundData) {
      setData(foundData);
    }
  };

  const handleUpdate = () => {
    onSubmit();
    setShowingModal(false);
  };

  const handleCancel = () => {
    setShowingModal(false);
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <div className='modal-container'>
      <div className='modal-content'>
        <h3>{`Connecting ${item} to entry...`}</h3>
        <div className='input-row'>
          <select className='dropdown-input' onChange={handleChange}>
            {data.map((item) => (
              <option>
                {item.first_name} {item.last_name}
              </option>
            ))}
          </select>
        </div>
        <div className='button-row'>
          <button className='button-brand-lighter-blue' onClick={handleUpdate}>
            Connect
          </button>
          <button className='button-brand-dark-blue' onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
