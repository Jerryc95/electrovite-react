import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import { RootState } from '../../../services/store';
import { AccountProfile } from 'src/models/accountProfile';

const SettingsProfile: React.FC = () => {
  const accountState = useSelector((state: RootState) => state.accountReducer);
  const [accountProfile, setAccountProfile] = useState<AccountProfile | null>(
    accountState.accountProfile,
  );
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState(false);

  const personalOnSubmit = () => {
    setEditingPersonal(!editingPersonal);
  };

  const businessOnSubmit = () => {
    setEditingBusiness(!editingBusiness);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const { name, value } = event.target;
    setAccountProfile((prevProfile) => ({ ...prevProfile!, [name]: value }));
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
          <div className='edit-settings-row'>
            <label className='edit-settings-label'>
              First Name
              {editingPersonal ? (
                <input
                  className='edit-settings-input'
                  type='text'
                  name='first_name'
                  placeholder={
                    accountProfile?.first_name
                      ? accountProfile.first_name
                      : 'First Name'
                  }
                  value={accountProfile?.first_name}
                  onChange={handleInputChange}
                />
              ) : (
                <span className='edit-settings-field'>
                  {accountProfile?.first_name}
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
                    accountProfile?.last_name
                      ? accountProfile.last_name
                      : 'Last Name'
                  }
                  type='text'
                  value={accountProfile?.last_name}
                  onChange={handleInputChange}
                />
              ) : (
                <span className='edit-settings-field'>
                  {accountProfile?.last_name}
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
                  accountProfile?.phone ? accountProfile.phone : '(123)456-7890'
                }
                value={accountProfile?.phone || ''}
                onChange={handleInputChange}
              />
            ) : (
              <span className='edit-settings-field'>
                {accountProfile?.phone ? accountProfile.phone : 'No Phone'}
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
                  accountProfile?.address
                    ? accountProfile.address
                    : 'Enter Address'
                }
                value={accountProfile?.address || ''}
                onChange={handleInputChange}
              />
            ) : (
              <span className='edit-settings-field'>
                {accountProfile?.address
                  ? accountProfile.address
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
                    accountProfile?.company ? accountProfile.company : 'Company'
                  }
                  value={accountProfile?.company || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <span className='edit-settings-field'>
                  {accountProfile?.company
                    ? accountProfile.company
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
                    accountProfile?.title
                      ? accountProfile.title
                      : 'Role or Title'
                  }
                  type='text'
                  value={accountProfile?.title || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <span className='edit-settings-field'>
                  {accountProfile?.title
                    ? accountProfile.title
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
                  accountProfile?.business_phone
                    ? accountProfile.business_phone
                    : 'Enter Business Phone Number'
                }
                value={accountProfile?.business_phone || ''}
                onChange={handleInputChange}
              />
            ) : (
              <span className='edit-settings-field'>
                {accountProfile?.business_phone
                  ? accountProfile.business_phone
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
                  accountProfile?.business_address
                    ? accountProfile.business_address
                    : 'Enter Business Address'
                }
                value={accountProfile?.business_address || ''}
                onChange={handleInputChange}
              />
            ) : (
              <span className='edit-settings-field'>
                {accountProfile?.business_address
                  ? accountProfile.business_address
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
