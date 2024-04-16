import { useNavigate } from 'react-router-dom';

const useBackClick = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return goBack;
};

export default useBackClick;
