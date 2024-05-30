import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import {
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
} from '../../../services/authAPI';
import { getUser, updateEmailState } from '../../../services/accountSlice';
import { checkEmail } from '../../../helpers/CheckEmail';
import { checkPassword } from '../../../helpers/CheckPassword';

const SettingsSecurity: React.FC = () => {
  const user = useSelector(getUser);

  const [editingSecurity, setEditingSecurity] = useState(false);
  const [editingTwoFactor, setEditingTwoFactor] = useState(false);

  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailAlertMessage, setEmailAlertMessage] = useState('');
  const [passwordAlertMessage, setPasswordAlertMessage] = useState('');

  const dispatch = useDispatch();

  const [updateEmail] = useUpdateEmailMutation();
  const [updatePassword] = useUpdatePasswordMutation();

  const toggleEdit = (
    setEditing: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setEditing((value) => !value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, value } = event.target;
    switch (name) {
      case 'email': {
        setEmail(value);
        break;
      }
      case 'confirm_email': {
        setConfirmEmail(value);
        break;
      }
      case 'password': {
        setCurrentPassword(value);
        break;
      }
      case 'new_password': {
        setPassword(value);
        break;
      }
      case 'confirm_password': {
        setConfirmPassword(value);
        break;
      }
      default:
        break;
    }
  };

  const handleUpdateEmail = () => {
    if (email !== confirmEmail) {
      setEmailAlertMessage('Emails do not match.');
    } else if (!checkEmail(email)) {
      setEmailAlertMessage('Email is not a valid Email address.');
    } else {
      dispatch(updateEmailState(email));
      updateEmail({ id: user.account?.id, email: email });
      setEmailAlertMessage('');
      toggleEdit(setEditingSecurity);
    }
  };

  const handleUpdatePassword = () => {
    if (!checkPassword(password)) {
      return setPasswordAlertMessage(
        'Password must be at least 8 characters long, have a number, and one uppercase letter.',
      );
    } else {
      updatePassword({
        id: user.account?.id,
        email: user.account?.email,
        password: currentPassword,
        newPassword: password,
      }).then((data) => {
        if(data) {
          console.log(data)
        } else {
          console.log("correct password")
        }
      });
      setPasswordAlertMessage("")
      toggleEdit(setEditingSecurity)
    }
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
        <div className='settings-form'>
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
                {user?.account?.email}
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
                <p>{emailAlertMessage}</p>
                {editingSecurity && (
                  <button
                    className='button-brand-blue'
                    onClick={handleUpdateEmail}
                  >
                    Update
                  </button>
                )}
              </div>
            )}
          </label>
        </div>
        <div className='settings-form'>
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
            <p>{passwordAlertMessage}</p>
              <button
                className='button-brand-blue'
                onClick={handleUpdatePassword}
              >
                Update
              </button>
            </div>
          )}
        </div>
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
            className={user.account?.two_factor_enabled ? 'on' : 'off'}
          >
            {user.account?.two_factor_enabled ? ' ON' : ' OFF'}
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
            {/* <div className='two-factor-option'>
              <div>
                <h5>Phone Number</h5>
                <p>
                  Add a phone number to receive a one-time code, ensuring secure
                  access to your account with added verification.
                </p>
              </div>
              <button className='button-brand-light-blue'>Setup</button>
            </div> */}
            {user.account?.two_factor_enabled ? (
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
