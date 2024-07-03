import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import { AccountProfile } from 'src/models/accountProfile';
import { useUpdateProfileMutation } from '../../../services/profileAPI';
import { getUser } from '../../../services/accountSlice';
import EmojiPicker from '../EmojiPicker';
import { checkPhone } from '../../../helpers/CheckPhone';

const SettingsProfile: React.FC = () => {
  const user = useSelector(getUser);
  const [accountProfile, setAccountProfile] = useState<AccountProfile>(
    user.accountProfile!,
  );
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [editedLabel, setEditedlabel] = useState('');
  const [editedValue, setEditedValue] = useState('');
  const [personalAlertMessage, setPersonalAlertMessage] = useState('');
  const [businessAlertMessage, setBusinessAlertMessage] = useState('');

  const [updateProfile] = useUpdateProfileMutation();
  

  const personalOnSubmit = () => {
    if (editedLabel != '') {
      if (accountProfile) {
        switch (editedLabel) {
          case 'first_name':
            if (editedValue.length > 50) {
              setPersonalAlertMessage(
                'First name can only be 50 characters long.',
              );
              return;
            }
            if (editedValue.length == 0) {
              setPersonalAlertMessage(
                'First name cannot be blank.',
              );
              return;
            }
            break;
          case 'last_name':
            if (editedValue.length > 50) {
              setPersonalAlertMessage(
                'Last name can only be 50 characters long.',
              );
              return;
            }
            if (editedValue.length == 0) {
              setPersonalAlertMessage(
                'Last name cannot be blank.',
              );
              return;
            }
            break;
          case 'address':
            if (editedValue.length > 255) {
              setPersonalAlertMessage(
                'Address can only be 255 characters long.',
              );
              return;
            }
            break;
          case 'phone':
            if (!checkPhone(editedValue)) {
              setPersonalAlertMessage(
                'Invalid phone number. Valid formats are 123-456-7890 or (123) 456-7890',
              );
              return;
            }
            break;
        }
        updateProfile(accountProfile);
      }
    }

    setEditingPersonal(!editingPersonal);
    setPersonalAlertMessage('');
  };

  const businessOnSubmit = () => {
    if (editedLabel != '') {
      if (accountProfile) {
        switch (editedLabel) {
          case 'company':
            if (editedValue.length > 100) {
              setBusinessAlertMessage(
                'Company name can only be 100 characters long.',
              );
              return;
            }
            break;
          case 'title':
            if (editedValue.length > 100) {
              setBusinessAlertMessage(
                'Business title can only be 100 characters long.',
              );
              return;
            }
            break;
          case 'business_address':
            if (editedValue.length > 255) {
              setBusinessAlertMessage(
                'Address can only be 255 characters long.',
              );
              return;
            }
            break;
          case 'business_phone':
            if (!checkPhone(editedValue)) {
              setBusinessAlertMessage(
                'Invalid phone number. Valid formats are 123-456-7890 or (123) 456-7890',
              );
              return;
            }
            break;
        }
        updateProfile(accountProfile);
      }
    }
    setEditingBusiness(!editingBusiness);
    setBusinessAlertMessage('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const { name, value } = event.target;
    setEditedlabel(name);
    setEditedValue(value);
    
    setAccountProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleEmojiChange = (emoji: string) => {
    if(user.accountProfile) {
      const updatedProfile: AccountProfile = {
        ...user.accountProfile,
        profile_pic: emoji,
      }
      setAccountProfile(updatedProfile)
      updateProfile(updatedProfile);
    }
  };

  const toggleEdit = (
    setEditing: React.Dispatch<React.SetStateAction<boolean>>,
    setAlertMessage: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    setEditing((value) => !value);
    setAlertMessage('');
  };

  return (
    <div className='sub-settings-container'>
      <div className='settings-section bottom-border'>
        <div className='settings-section-header'>
          <h4>Personal Information</h4>
          <div
            className='settings-section-edit'
            onClick={() =>
              toggleEdit(setEditingPersonal, setPersonalAlertMessage)
            }
          >
            {editingPersonal ? <span>Cancel</span> : <span>Edit</span>}

            <FontAwesomeIcon
              icon={faPenToSquare}
              className='edit-icon'
              size='sm'
            />
          </div>
        </div>
        <div className='settings-form'>
          {editingPersonal && <EmojiPicker onChange={handleEmojiChange} />}
          <div className='edit-settings-row'>
            <label className='edit-settings-label'>
              First Name
              {editingPersonal ? (
                <input
                  className='edit-settings-input'
                  type='text'
                  name='first_name'
                  placeholder={
                    user.accountProfile?.first_name
                      ? user.accountProfile.first_name
                      : 'First Name'
                  }
                  value={accountProfile?.first_name}
                  onChange={handleInputChange}
                />
              ) : (
                <span className='edit-settings-field'>
                  {user.accountProfile?.first_name}
                </span>
              )}
            </label>
            <label className='edit-settings-label'>
              Last Name
              {editingPersonal ? (
                <input
                  className='edit-settings-input'
                  name='last_name'
                  placeholder={
                    user.accountProfile?.last_name
                      ? user.accountProfile.last_name
                      : 'Last Name'
                  }
                  type='text'
                  value={accountProfile?.last_name}
                  onChange={handleInputChange}
                />
              ) : (
                <span className='edit-settings-field'>
                  {user.accountProfile?.last_name}
                </span>
              )}
            </label>
          </div>
          <label className='edit-settings-label'>
            Phone Number
            {editingPersonal ? (
              <input
                className='edit-settings-input'
                type='text'
                name='phone'
                placeholder={
                  user.accountProfile?.phone
                    ? user.accountProfile.phone
                    : '(123) 456-7890'
                }
                value={accountProfile?.phone || ''}
                onChange={handleInputChange}
              />
            ) : (
              <span className='edit-settings-field'>
                {user.accountProfile?.phone
                  ? user.accountProfile.phone
                  : 'No Phone'}
              </span>
            )}
          </label>
          <label className='edit-settings-label'>
            Address
            {editingPersonal ? (
              <input
                className='edit-settings-input'
                type='text'
                name='address'
                placeholder={
                  user.accountProfile?.address
                    ? user.accountProfile.address
                    : 'Enter Address'
                }
                value={accountProfile?.address || ''}
                onChange={handleInputChange}
              />
            ) : (
              <span className='edit-settings-field'>
                {user.accountProfile?.address
                  ? user.accountProfile.address
                  : 'No Address'}
              </span>
            )}
          </label>
          {editingPersonal && (
            <div>
              <button className='button-brand-blue' onClick={personalOnSubmit}>
                Update
              </button>
              <h5 className='brand-pink'>{personalAlertMessage}</h5>
            </div>
          )}
        </div>
      </div>
      <div className='settings-section'>
        <div className='settings-section-header'>
          <h4>Business Information</h4>
          <div
            className='settings-section-edit'
            onClick={() =>
              toggleEdit(setEditingBusiness, setBusinessAlertMessage)
            }
          >
            {editingBusiness ? <span>Cancel</span> : <span>Edit</span>}

            <FontAwesomeIcon
              icon={faPenToSquare}
              className='edit-icon'
              size='sm'
            />
          </div>
        </div>
        <div className='settings-form'>
          <div className='edit-settings-row'>
            <label className='edit-settings-label'>
              Company
              {editingBusiness ? (
                <input
                  className='edit-settings-input'
                  type='text'
                  name='company'
                  placeholder={
                    user.accountProfile?.company
                      ? user.accountProfile.company
                      : 'Company'
                  }
                  value={accountProfile?.company || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <span className='edit-settings-field'>
                  {user.accountProfile?.company
                    ? user.accountProfile.company
                    : 'No Company'}
                </span>
              )}
            </label>
            <label className='edit-settings-label'>
              Role
              {editingBusiness ? (
                <input
                  className='edit-settings-input'
                  name='title'
                  placeholder={
                    user.accountProfile?.title
                      ? user.accountProfile.title
                      : 'Role or Title'
                  }
                  type='text'
                  value={accountProfile?.title || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <span className='edit-settings-field'>
                  {user.accountProfile?.title
                    ? user.accountProfile.title
                    : 'No Role or Title'}
                </span>
              )}
            </label>
          </div>
          <label className='edit-settings-label'>
            Business Phone Number
            {editingBusiness ? (
              <input
                className='edit-settings-input'
                type='text'
                name='business_phone'
                placeholder={
                  user.accountProfile?.business_phone
                    ? user.accountProfile.business_phone
                    : 'Enter Business Phone Number'
                }
                value={accountProfile?.business_phone || ''}
                onChange={handleInputChange}
              />
            ) : (
              <span className='edit-settings-field'>
                {user.accountProfile?.business_phone
                  ? user.accountProfile.business_phone
                  : 'No Business Phone'}
              </span>
            )}
          </label>
          <label className='edit-settings-label'>
            Business Address
            {editingBusiness ? (
              <input
                className='edit-settings-input'
                type='text'
                name='business_address'
                placeholder={
                  user.accountProfile?.business_address
                    ? user.accountProfile.business_address
                    : 'Enter Business Address'
                }
                value={accountProfile?.business_address || ''}
                onChange={handleInputChange}
              />
            ) : (
              <span className='edit-settings-field'>
                {user.accountProfile?.business_address
                  ? user.accountProfile.business_address
                  : 'No Business Address'}
              </span>
            )}
          </label>
          {editingBusiness && (
            <div>
              {' '}
              <button
                className='button-brand-dark-blue'
                onClick={businessOnSubmit}
              >
                Update
              </button>
              <h5 className='brand-pink'>{businessAlertMessage}</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsProfile;
