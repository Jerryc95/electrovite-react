import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useRegisterAccountMutation,
  useSignInAccountMutation,
} from '../../services/authAPI';
import ProfileEditForm from '$renderer/components/ProfileEditForm';

interface Subscription {
  id: number;
  name: string;
  description: string;
  price: number;
  billing_cycle: string;
  features: string[];
}

interface ProfileSetupPageProps {
  setCreationStep: React.Dispatch<React.SetStateAction<number>>;
  email: string;
  password: string;
  subscription: Subscription | null;
}

const ProfileSetupPage: React.FC<ProfileSetupPageProps> = ({
  email,
  password,
  setCreationStep,
  subscription,
}) => {
  const [registerAccount] = useRegisterAccountMutation();
  const [signInAccount] = useSignInAccountMutation();


  const navigate = useNavigate();
  const handleSetup = (formData: {
    firstName: string;
    lastName: string;
    profilePic: string;
    logo: File | null | undefined;
    company: string | null;
    role: string | null;
  }) => {
    console.log('form:', formData);
    console.log('email', email);
    console.log('password:', password);
    console.log('subscription:', subscription);
    registerAccount({
      profile: formData,
      email: email,
      password: password,
      subscription: subscription,
    }).then(() => {
      signInAccount({ email: email, password: password }).then(() => {
        
        navigate('/creating-account');
      });
    });
  };

  const handleBackClick = () => {
    console.log('clicked');
    if (subscription?.id !== 1) {
      setCreationStep(2);
    } else {
      setCreationStep(1);
    }
  };

  return (
    <div className='profile-edit-form-container'>
      <h2>Set up your profile</h2>
      <p className='profile-edit-form-description'>
        Please take a moment to set up your account to help streamline your
        workflow.
      </p>
      <ProfileEditForm
        type='creating'
        onSubmit={handleSetup}
        handleBackClick={handleBackClick}
      />
    </div>
  );
};

export default ProfileSetupPage;
