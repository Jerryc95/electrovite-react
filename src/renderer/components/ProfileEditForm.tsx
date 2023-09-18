import React, { useState } from 'react';
import { useSelector } from 'react-redux/es/hooks/useSelector';

import '../styles/profileEditForm.scss';
import AvatarPicker from './AvatarPicker';

import { RootState } from '../../services/store';
import PhotoUploader from './PhotoUploader';

interface ProfileEditFormProps {
  type: 'creating' | 'editing';
  onSubmit: (formData: {
    firstName: string;
    lastName: string;
    profilePic: string;
    logo: File | null | undefined;
    company: string | null;
    role: string | null;
  }) => void;
  handleBackClick: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  type,
  onSubmit,
  handleBackClick,
}) => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [logo, setLogo] = useState<File | null | undefined>(null);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      firstName,
      lastName,
      profilePic,
      logo,
      company,
      role,
    });
  };

  return (
    <div>
      <form className='profile-edit-form' onSubmit={handleSubmit}>
        <div className='profile-edit-form-avatar'>
          <p>Profile Picture:</p>
          <AvatarPicker setSelectedProfilePic={setProfilePic} />
        </div>
        <label className='profile-edit-form-label'>
          First Name
          <input
            className='profile-edit-form-input'
            type='text'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
        <label className='profile-edit-form-label'>
          Last Name
          <input
            className='profile-edit-form-input'
            type='text'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
        <p>Add optional business info to your profile below.</p>
        <div className='profile-edit-optional-section'>
          <label className='profile-edit-form-label'>
            Company
            <input
              className='profile-edit-form-input'
              type='text'
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </label>
          <label className='profile-edit-form-label'>
            Role
            <input
              className='profile-edit-form-input'
              type='text'
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </label>
        </div>
        {/* <div className='profile-edit-photo-uploader'>
          <p>Logo</p>
          <PhotoUploader selectedPhoto={logo} setSelectedPhoto={setLogo} />
        </div> */}
        {type === 'creating' && (
          <div className='profile-edit-submit-button'>
            <button className='button-brand-light-blue' onClick={handleBackClick}>Back</button>
            <button className='button-brand-pink'>Get Started</button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileEditForm;
