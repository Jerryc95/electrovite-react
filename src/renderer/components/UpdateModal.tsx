import React, { useEffect, ChangeEvent } from 'react';

import '../styles/modal.scss';
import { BKEntry } from 'src/models/BKEntry';

interface BKClient {
  id: number;
  first_name: string;
  last_name: string;
  type: 'contact';
}

interface BKProject {
  id: number;
  name: string;
  type: 'project';
}

interface IEntry {
  id: number;
  entry_name: string;
  type: 'entry'
}

type BKData = BKClient | BKProject | IEntry;

interface UpdateModalProps {
  onSubmit: () => void;
  onLoad: () => void;
  setShowingModal: React.Dispatch<React.SetStateAction<boolean>>;
  currentItem: string;
  connectingItem: string;
  data: BKData[];
  setData: React.Dispatch<React.SetStateAction<BKData | null>>;
  height: string;
  width: string;
}

//UPDATE THIS
const UpdateModal: React.FC<UpdateModalProps> = ({
  onSubmit,
  onLoad,
  setShowingModal,
  currentItem,
  connectingItem,
  data,
  setData,
  height,
  width,
}) => {
  const getItemListOptions = (item: BKData) => {

    switch (item.type) {
      case 'contact':
        return `${item.first_name} ${item.last_name}`;
      case 'project':
        return `${item.name}`;
      case 'entry':
        return `${item.entry_name}`;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const foundData = data.find((i) => {
      if (i.type === 'contact') {
        return i.first_name + ' ' + i.last_name === e.target.value;
      }
      if (i.type === 'project') {
        return i.name === e.target.value;
      }
      if(i.type === 'entry') {
        
        return i.entry_name === e.target.value
      }
    });
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
  }, [onLoad]);

  return (
    <div className='modal-container'>
      <div className='modal-content' style={{ width: width, height: height }}>
        <h3>{`Connecting ${currentItem} to ${connectingItem}...`}</h3>
        <div className='input-row'>
          <select className='dropdown-input' onChange={handleChange}>
            {data.map((item) => (
              <option key={item.id}>
                {getItemListOptions(item)}
              </option>
            ))}
          </select>
        </div>
        <div className='button-row'>
          <button className='button-brand-dark-blue' onClick={handleCancel}>
            Cancel
          </button>
          <button className='button-brand-lighter-blue' onClick={handleUpdate}>
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
