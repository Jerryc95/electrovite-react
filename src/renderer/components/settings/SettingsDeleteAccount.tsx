import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { RootState } from '../../../services/store';
import { useDeleteAccountMutation } from '../../../services/authAPI';

const SettingsDeleteAccount: React.FC = () => {
  const accountState = useSelector((state: RootState) => state.accountReducer);

  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const [deleteAccount] = useDeleteAccountMutation();
  

  const toggleDeleteAccount = () => {
    setShowDeleteAccount(!showDeleteAccount);
  };

  const handleDeleteAccount = () => {
    try {
      if (password == confirmPassword) {
        const accountObject = {
          email: accountState.account?.email,
          password: password,
        }
        deleteAccount(accountObject).then((data) => {
          if('error' in data) {
            console.log(data)
            setAlertMessage("Error deleting account.")
          } else {
            navigate('/')
          }
        })
      } else {
        setAlertMessage('Passwords do not match.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='sub-settings-container'>
      <div className='settings-section'>
        <div className='settings-section-header'>
          <h4>Delete Account</h4>
        </div>
        <p>
          Deleting your account is a permanent action, and once completed, all
          associated data, including projects, contacts, and other information,
          will be irreversibly removed from our system. However, to prevent
          accidental deletions, we offer a 30-day recovery period. During this
          time, you can sign in to regain access to your account. After the
          30-day period, the deletion will be irreversible, so please consider
          this decision carefully. Once the recovery period elapses, there will
          be no way to retrieve your account or its contents.{' '}
        </p>
        <button
          className='button-brand-pink delete'
          onClick={toggleDeleteAccount}
        >
          Delete Account
        </button>
      </div>
      {showDeleteAccount && (
        <div className='delete-account-container'>
          <div className='delete-account-form'>
            <h4>Deleting Account...</h4>
            <span>
              Please enter and confirm your password to delete your account.
            </span>
            <label className='delete-account-label'>
              Password
              <input
                className='delete-account-input'
                type='password'
                name='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label className='delete-account-label'>
              Confirm Password
              <input
                className='delete-account-input'
                type='password'
                name='password'
                placeholder='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
            <div className='button-row'>
              <button
                className='button-brand-blue'
                onClick={toggleDeleteAccount}
              >
                Cancel
              </button>
              <button
                className='button-brand-pink'
                onClick={handleDeleteAccount}
              >
                Delete
              </button>
            </div>
            <p className='alert'>{alertMessage}</p>
            <p>Deleting your account is permanent and irreversible.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDeleteAccount;
