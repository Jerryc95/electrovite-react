import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import { AccountProfile } from 'src/models/accountProfile';
import { useUpdateProfileMutation } from '../../../services/profileAPI';
import { getUser } from '../../../services/accountSlice';
import EmojiPicker from '../EmojiPicker';

const SettingsProfile: React.FC = () => {
  const user = useSelector(getUser);
  const [accountProfile, setAccountProfile] = useState<AccountProfile | null>(
    user.accountProfile,
  );
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(false);
  const [editedLabel, setEditedlabel] = useState('');
  const [editedValue, setEditedValue] = useState('');

  const [updateProfile] = useUpdateProfileMutation();

  const personalOnSubmit = () => {
    if (editedValue != '' && editedLabel != '') {
      if (accountProfile) {
        updateProfile(accountProfile);
      }
    }

    setEditingPersonal(!editingPersonal);
  };

  const businessOnSubmit = () => {
    if (editedValue != '' && editedLabel != '') {
      if (accountProfile) {
        updateProfile(accountProfile);
      }
    }
    setEditingBusiness(!editingBusiness);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const { name, value } = event.target;
    setEditedlabel(name);
    setEditedValue(value);
    setAccountProfile((prevProfile) => ({ ...prevProfile!, [name]: value }));
  };

  const handleEmojiChange = (emoji: string) => {
    const updatedProfile: AccountProfile = {
      id: user.accountProfile!.id,
      account_id: user.accountProfile!.account_id,
      first_name: user.accountProfile!.first_name,
      last_name: user.accountProfile!.last_name,
      phone: user.accountProfile!.phone,
      address: user.accountProfile!.address,
      profile_pic: emoji,
      theme: user.accountProfile!.theme,
      company: user.accountProfile!.company,
      title: user.accountProfile!.title,
      business_phone: user.accountProfile!.business_phone,
      business_address: user.accountProfile!.business_address,
    };

    updateProfile(updatedProfile);

    // if (accountProfile) {
    //   // dispatch(updateProfileState(accountProfile));
    //    updateProfile(accountProfile);
    // }
  };

  const toggleEdit = (
    setEditing: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setEditing((value) => !value);
  };

  return (
    <div className='sub-settings-container'>
      <div className='settings-section bottom-border'>
        <div className='settings-section-header'>
          <h4>Personal Information</h4>
          <div
            className='settings-section-edit'
            onClick={() => toggleEdit(setEditingPersonal)}
          >
            {editingPersonal ? <span>Cancel</span> : <span>Edit</span>}

            <FontAwesomeIcon
              icon={faPenToSquare}
              className='edit-icon'
              size='sm'
            />
          </div>
        </div>
        <form className='settings-form'>
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
            <button className='button-brand-blue' onClick={personalOnSubmit}>
              Update
            </button>
          )}
        </form>
      
      </div>
      <div className='settings-section'>
        <div className='settings-section-header'>
          <h4>Business Information</h4>
          <div
            className='settings-section-edit'
            onClick={() => toggleEdit(setEditingBusiness)}
          >
            {editingBusiness ? <span>Cancel</span> : <span>Edit</span>}

            <FontAwesomeIcon
              icon={faPenToSquare}
              className='edit-icon'
              size='sm'
            />
          </div>
        </div>
        <form className='settings-form'>
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
            <button
              className='button-brand-dark-blue'
              onClick={businessOnSubmit}
            >
              Update
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SettingsProfile;
