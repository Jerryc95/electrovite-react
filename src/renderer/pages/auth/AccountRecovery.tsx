import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useBackClick from '../../../hooks/useBackClick';
import { getUser, setSignIn, setTwoFactorEnabled } from '../../../services/accountSlice';
import { useFetchSubscriptionInfoMutation } from '../../../services/subscriptionAPI';

const AccountRecovery: React.FC = () => {
  const user = useSelector(getUser);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const goBack = useBackClick();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fetchSubscriptionInfo] = useFetchSubscriptionInfoMutation();

  const handleSubmitRecoveryCode = async () => {
    console.log(recoveryCode);
    const url = 'http://localhost:3000/auth/security/recover';
    const data = {
      id: user.account?.id,
      recoveryCode: recoveryCode,
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
        fetchSubscriptionInfo(user.account!.id).then(() => {
          dispatch(setSignIn(true));
          dispatch(setTwoFactorEnabled(false))
          navigate('/');
        });
      } else {
        setIsValid(false);
      }
      if (!response.ok) {
        setIsValid(false);
      }
    } catch (error) {
      console.log(error);
      setIsValid(false);
    }
  };

  return (
    <div className='two-factor-login-container'>
      <h2>Recover Account</h2>
      <p>
        Enter your recovery key that was created two-factor authentication was
        first setup. Entering your code will disable two-factor authentication
        and allow you to regain access to your account. If you do not have your
        recovery code, please contact support.
      </p>
      <label>
        Recovery key:
        <input
          type='text'
          value={recoveryCode}
          onChange={(e) => setRecoveryCode(e.target.value)}
          onBlur={handleSubmitRecoveryCode}
        />
      </label>
     
      <button
        className='button-brand-light-blue'
        onClick={handleSubmitRecoveryCode}
      >
        Submit
      </button>
      <button className='button-brand-pink' onClick={goBack}>
        Back
      </button>
      {isValid !== null && isValid == false && (
        <p className='token-error'>Incorrect recovery code</p>
      )} 
      <p className='lost-2fa-callout'>Contact Support</p>
    </div>
  );
};

export default AccountRecovery;
