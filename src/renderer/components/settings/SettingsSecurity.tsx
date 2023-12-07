import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import { RootState } from '../../../services/store';

const SettingsSecurity: React.FC = () => {
  const accountState = useSelector((state: RootState) => state.accountReducer);

  const [editingSecurity, setEditingSecurity] = useState(false);
  const [editingTwoFactor, setEditingTwoFactor] = useState(false);

  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleEdit = (
    setEditing: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setEditing((value) => !value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    // const { name, value } = event.target;
    // setAccountProfile((prevProfile) => ({ ...prevProfile!, [name]: value }));
  };

  return (
    <div className='sub-settings-container'>
      <div className='settings-section bottom-border'>
        <div className='settings-section-header'>
          <h4>Account Security</h4>
          <div
            className='settings-section-edit'
            onClick={() => toggleEdit(setEditingSecurity)}
          >
            {editingSecurity ? <span>Cancel</span> : <span>Edit</span>}
            <FontAwesomeIcon
              icon={faPenToSquare}
              className='edit-icon'
              size='sm'
            />
          </div>
        </div>
        <form className='settings-form'>
          <label className='edit-settings-label'>
            Email
            {editingSecurity ? (
              <input
                className='edit-settings-input'
                type='text'
                name='email'
                placeholder='New Email'
                value={email}
                onChange={handleInputChange}
              />
            ) : (
              <span className='edit-settings-field'>
                {accountState?.account?.email}
              </span>
            )}
          </label>
          <label className='edit-settings-label'>
            {editingSecurity && (
              <div>
                <input
                  className='edit-settings-input'
                  type='text'
                  name='confirm_email'
                  placeholder='Confirm New Email'
                  value={confirmEmail}
                  onChange={handleInputChange}
                />
                {editingSecurity && (
                  <button
                    className='button-brand-blue'
                    onClick={() => console.log('hi')}
                  >
                    Update
                  </button>
                )}
              </div>
            )}
          </label>
          <label className='edit-settings-label'>
            Password
            {editingSecurity ? (
              <input
                className='edit-settings-input'
                type='password'
                name='password'
                placeholder='Current Password'
                value={currentPassword}
                onChange={handleInputChange}
              />
            ) : (
              <span className='edit-settings-field'>••••••••</span>
            )}
          </label>
          {editingSecurity && (
            <div>
              <label className='edit-settings-label'>
                <input
                  className='edit-settings-input'
                  type='password'
                  name='new_password'
                  placeholder='New Password'
                  value={password}
                  onChange={handleInputChange}
                />
              </label>
              <label className='edit-settings-label'>
                <input
                  className='edit-settings-input'
                  type='password'
                  name='confirm_password'
                  placeholder='Confirm New Password'
                  value={confirmPassword}
                  onChange={handleInputChange}
                />
              </label>

              <button
                className='button-brand-blue'
                onClick={() => console.log('hi')}
              >
                Update
              </button>
            </div>
          )}
        </form>
      </div>
      <div className='settings-section'>
        <div className='settings-section-header'>
          <h4>Two-Factor Authentication</h4>
          <div
            className='settings-section-edit'
            onClick={() => toggleEdit(setEditingTwoFactor)}
          >
            {editingTwoFactor ? <span>Cancel</span> : <span>Edit</span>}

            <FontAwesomeIcon
              icon={faPenToSquare}
              className='edit-icon'
              size='sm'
            />
          </div>
        </div>
        <p>
          Two-factor authentication (2FA) adds an extra layer of security to
          your accounts. In addition to your password, it requires a second form
          of verification, such as a temporary code sent to your phone. This
          ensures heightened protection, making it more challenging for
          unauthorized users to access your accounts even if your password is
          compromised.
        </p>
        <h5>
          Two-factor authentication is
          <span
            className={accountState.account?.two_factor_enabled ? 'on' : 'off'}
          >
            {accountState.account?.two_factor_enabled ? ' ON' : ' OFF'}
          </span>
        </h5>

        {editingTwoFactor && (
          <div className='two-factor-options-container'>
            <div className='two-factor-option bottom-border'>
              <div>
                <h5>Authenticator App</h5>
                <p>
                  Set Up Two-Factor Authentication with Trusted Apps Like Google
                  Authenticator, Authy, or Microsoft Authenticator
                </p>
              </div>
              <button className='button-brand-light-blue'>Setup</button>
            </div>
            <div className='two-factor-option'>
              <div>
                <h5>Phone Number</h5>
                <p>
                  Add a phone number to receive a one-time code, ensuring secure
                  access to your account with added verification.
                </p>
              </div>
              <button className='button-brand-light-blue'>Setup</button>
            </div>
            {accountState.account?.two_factor_enabled ? (
              <button>Disable</button>
            ) : (
              <></>
              // <button>Disable</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsSecurity;
