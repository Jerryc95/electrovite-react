import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from 'src/services/store';
import { useFetchProfileMutation } from '../../services/profileAPI';
import '../styles/spinner.scss';
import { useFetchSubscriptionInfoMutation } from '../../services/subscriptionAPI';

interface CreatingAccountProps {
  creating: boolean;
}

const CreatingAccountPage: React.FC<CreatingAccountProps> = ({ creating }) => {
  const accountState = useSelector((state: RootState) => state.accountReducer);
  const [fetchProfile] = useFetchProfileMutation();
  const [fetchSubscriptionInfo] = useFetchSubscriptionInfoMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (accountState.account) {
      fetchProfile(accountState.account.id).then(() => {
        if (accountState.account) {
          fetchSubscriptionInfo(accountState.account.id).then(() => {
            navigate('/dashboard');
          });
        }
      });
    }
  }, [accountState.account, fetchProfile, fetchSubscriptionInfo, navigate]);

  return (
    <div className='spinner-container'>
      {creating ? <h1>Creating Account...</h1> : <h1>Loading Account...</h1>}

      <div className='spinner'></div>
    </div>
  );
};

export default CreatingAccountPage;
