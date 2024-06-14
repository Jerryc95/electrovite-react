import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUser, setTwoFactorEnabled } from '../../../services/accountSlice';

interface TwoFactorDisableProps {
  setShowingTwoFactorDisable: React.Dispatch<React.SetStateAction<boolean>>;
}

const TwoFactorDisableForm: React.FC<TwoFactorDisableProps> = ({
  setShowingTwoFactorDisable,
}) => {
  const user = useSelector(getUser);

  const [token, setToken] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const dispatch = useDispatch();

  const handleDisableTwoFactor = async () => {
    const url = 'http://localhost:3000/auth/security/verify-token';
    const data = {
      id: user.account?.id,
      token: token,
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData.isValid == true) {
        // DB update here
        const disableUrl =
          'http://localhost:3000/auth/security/disable-two-factor';
        const disableData = {
          id: user.account?.id,
        };
        try {
          const disableResponse = await fetch(disableUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(disableData),
          });
          const disableResponseData = await disableResponse.json();
          if (disableResponseData.isDisabled == true) {
            dispatch(setTwoFactorEnabled(false));
            setShowingTwoFactorDisable(false)
          } else {
            setIsValid(false)
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        setIsValid(false)
      }
      if (!response.ok) {
        throw new Error('Failed to update token');
      }
    } catch (error) {
      console.log(error);
    }
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
        <button className='button-brand-pink' onClick={handleDisableTwoFactor}>Disable</button>
      </div>
    </div>
  );
};

export default TwoFactorDisableForm;
