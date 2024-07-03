import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import '../../styles/twoFactor.scss';
import {
  getUser,
  resetAccountState,
  setSignIn,
} from '../../../services/accountSlice';
import { useFetchSubscriptionInfoMutation } from '../../../services/subscriptionAPI';
import { useVerifyTokenMutation } from '../../../services/authAPI';
import { SignInStatus } from '../../../statuses/signInStatus';

const TwoFactorForm: React.FC = () => {
  const user = useSelector(getUser);
  const [token, setToken] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [verifyToken] = useVerifyTokenMutation();
  const [fetchSubscriptionInfo] = useFetchSubscriptionInfoMutation();

  const handleBackClick = () => {
    dispatch(resetAccountState);
    navigate('/');
  };

  const handleLostCodeClick = () => {
    navigate('/security/lost-code');
  };

  const handleVerifyToken = async () => {
    const data = {
      id: user.account?.id,
      token: token,
    };
    verifyToken(data).then((res) => {
      if ('data' in res) {
        if (res.data.isValid == true && user.account) {
          fetchSubscriptionInfo(user.account.id).then(() => {
            dispatch(setSignIn(SignInStatus.True));
            navigate('/dashboard');
          });
        } else {
            setIsValid(false)
        }
      }
    });
  };

  return (
    <div className='two-factor-login-container'>
      <h2 className='two-factor-login-heading'>Verify Your Identity</h2>
      <p>Enter the code in your authenticator app to sign in and continue.</p>
      <label className='auth-form-label'>
        Verication Code:
        <input
          className='auth-form-input'
          type='text'
          value={token}
          onChange={(e) => setToken(e.target.value)}
          onBlur={handleVerifyToken}
          placeholder='123456'
        />
      </label>
      <button className='button-brand-blue' onClick={handleVerifyToken}>
        Verify
      </button>
      <button className='button-brand-pink' onClick={handleBackClick}>
        Back
      </button>
      {isValid !== null && isValid == false && (
        <p className='token-error'>Incorrect token code. Please try again.</p>
      )}
      <p className='lost-2fa-callout' onClick={handleLostCodeClick}>
        Lost your two-factor-authentication device?
      </p>
    </div>
  );
};

export default TwoFactorForm;
