import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setSelectedEntry } from '../services/bookkeepingSlice';
import { BKEntry } from 'src/models/BKEntry';

const useToggleEntry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleEntry = (entry: BKEntry) => {
    dispatch(setSelectedEntry(entry));
    navigate(`/bookkeeping/${entry.entry_name.replaceAll(' ', '-')}`);
  };

  return toggleEntry;
};

export default useToggleEntry;
