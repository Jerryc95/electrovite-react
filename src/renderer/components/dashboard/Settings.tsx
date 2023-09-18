import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../services/store';

const Settings: React.FC = () => {
    const accountState = useSelector(
        (state: RootState) => state.accountReducer,
      );
  return (
    <div>
      <div>Settings</div>
      <div>Account ID: {accountState.accountProfile?.account_id} </div>
    </div>
  );
};

export default Settings;
