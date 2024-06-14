import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { QRCodeSVG } from 'qrcode.react';

import { getUser, setTwoFactorEnabled } from '../../../services/accountSlice';
import TwoFactorCompletion from './TwoFactorCompletion';

interface TwoFactorSetupProps {
  setShowingTwoFactorSetup: React.Dispatch<React.SetStateAction<boolean>>;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({
  setShowingTwoFactorSetup,
}) => {
  const user = useSelector(getUser);
  const [showingTwoFactorComplete, setShowingTwoFactorComplete] =
    useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [otpAuthUrl, setOtpAuthUrl] = useState('');
  const [token, setToken] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const dispatch = useDispatch();

  const generateSecret = async () => {
    const url = 'http://localhost:3000/auth/security/generate-secret';
    const data = {
      id: user.account?.id,
      email: user.account?.email,
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
      setSecretKey(responseData.secret);
      setOtpAuthUrl(responseData.otpAuthUrl);
      setRecoveryKey(responseData.recoveryCode);
      if (!response.ok) {
        throw new Error('Failed to update value');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyToken = async () => {
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
        dispatch(setTwoFactorEnabled(true));
        setShowingTwoFactorComplete(true);
      } else {
        setIsValid(false);
      }
      if (!response.ok) {
        throw new Error('Failed to update token');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelSetup = () => {
    // deleted secret that was added to the DB
    setShowingTwoFactorSetup(false);
  };

  useEffect(() => {
    generateSecret();
  }, []);

  return (
    <div className='two-factor-setup-container'>
      <div className='two-factor-setup-form'>
        <div className='two-factor-setup-heading'>
          <h2>Enable Two-Factor Authenication</h2>
          <button
            className='button-brand-pink'
            onClick={cancelSetup}
          >
            Cancel
          </button>
        </div>
        <div className='two-factor-setup-content-row'>
          <div className='two-factor-setup-column'>
            <h3>Configuring Two-Factor Authenication</h3>
            <ol>
              <li>
                Install or Open your preferred authenticator App such as Google
                Authenticator, Authy, or Microsoft Authenticator.
              </li>
              <li>Within the app, select the add or + button.</li>
              <li>Follow the steps to scan or enter the secret key.</li>
            </ol>
          </div>
          <div className='two-factor-setup-column'>
            <h3>Scan QR Code</h3>
            <div className='two-factor-setup-qr-container'>
              {secretKey ? (
                <QRCodeSVG value={otpAuthUrl} />
              ) : (
                <div className='spinner-container'>
                  <div className='spinner'></div>
                </div>
              )}
            </div>
            <h3>Or Enter Code Manually</h3>
            <p className='two-factor-setup-secret-key'>
              Secret Key: {secretKey}
            </p>

            <h3>Verify Code</h3>
            <input
              className='two-factor-form-input'
              placeholder='Authenication Code'
              type='text'
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            {isValid != null && isValid == false && (
              <p className='two-factor-error'>Incorrect Token Code</p>
            )}
          </div>
        </div>
        <button className='button-brand-purple' onClick={verifyToken}>
          Verify & Activate
        </button>
      </div>
      {showingTwoFactorComplete && (
        <TwoFactorCompletion
          setShowingTwoFactorSetup={setShowingTwoFactorSetup}
          setShowingTwoFactorComplete={setShowingTwoFactorComplete}
          recoveryKey={recoveryKey}
        />
      )}
    </div>
  );
};

export default TwoFactorSetup;
