import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUser, setTwoFactorEnabled } from '../../../services/accountSlice';
import {
  useDisableTwoFactorMutation,
  useVerifyTokenMutation,
} from '../../../services/authAPI';

interface TwoFactorDisableProps {
  setShowingTwoFactorDisable: React.Dispatch<React.SetStateAction<boolean>>;
}

const TwoFactorDisableForm: React.FC<TwoFactorDisableProps> = ({
  setShowingTwoFactorDisable,
}) => {
  const user = useSelector(getUser);

  const [token, setToken] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const [verifyToken] = useVerifyTokenMutation();
  const [disableTwoFactor] = useDisableTwoFactorMutation();

  const dispatch = useDispatch();

  const handleDisableTwoFactor = async () => {
    const data = {
      id: user.account?.id,
      token: token,
    };
    verifyToken(data).then((res) => {
      if ('data' in res) {
        if (res.data.isValid == true) {
          disableTwoFactor({ id: user.account?.id }).then((disableRes) => {
            if ('data' in disableRes) {
              if (disableRes.data.isDisabled == true) {
                dispatch(setTwoFactorEnabled(false));
                setShowingTwoFactorDisable(false);
              } else {
                setIsValid(false);
              }
            }
          });
        } else {
          setIsValid(false);
        }
      }
    });
  };
  return (
    <div className='two-factor-disable-container'>
      <div className='two-factor-disable-form'>
        <div className='two-factor-disable-heading'>
          <h2>Disable Two-Factor Authenication</h2>
          <button
            className='button-brand-darker-purple'
            onClick={() => {
              setShowingTwoFactorDisable(false);
            }}
          >
            Cancel
          </button>
        </div>
        <p>
          To disable two-factor authentication, please enter code in your
          authenticator app.
        </p>
        <input
          className='two-factor-form-input'
          placeholder='Authenication Code'
          type='text'
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
        {isValid != null && isValid == false && (
          <p className='token-error'>Invalid Token</p>
        )}
        <button className='button-brand-pink' onClick={handleDisableTwoFactor}>
          Disable
        </button>
      </div>
    </div>
  );
};

export default TwoFactorDisableForm;
