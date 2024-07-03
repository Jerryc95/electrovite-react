import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectPage } from '../services/accountSlice';

type ClosePaywallCallback = () => void;

const useClosePaywall = (onCloseCallback?: ClosePaywallCallback) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closePaywall = (previousPage?: string) => {
    if (onCloseCallback) {
      onCloseCallback();
    } else if (previousPage) {
      dispatch(selectPage(previousPage));
      navigate(-1);
    }
  };

  return closePaywall;
};

export default useClosePaywall;
