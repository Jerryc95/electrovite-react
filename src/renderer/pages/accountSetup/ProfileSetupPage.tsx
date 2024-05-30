import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useRegisterAccountMutation,
  useSignInAccountMutation,
} from '../../../services/authAPI';
import ProfileEditForm from '$renderer/components/ProfileEditForm';
import { StripeSubscription } from 'src/models/stripeSubscription';
import { useSelector } from 'react-redux';
import { getStripeCustomer } from '../../../services/subscriptionSlice';
import { useDeleteCustomerMutation } from '../../../services/subscriptionAPI';

interface Subscription {
  id: number;
  name: string;
  description: string;
  price: number;
  billing_cycle: string;
  features: string[];
  stripe_price_id: string;
}

interface ProfileSetupPageProps {
  setCreationStep: React.Dispatch<React.SetStateAction<number>>;
  email: string;
  password: string;
  subscription: Subscription | null;
  stripeSubscription: StripeSubscription | null;
}

const ProfileSetupPage: React.FC<ProfileSetupPageProps> = ({
  email,
  password,
  setCreationStep,
  subscription,
  stripeSubscription,
}) => {
  const [registerAccount] = useRegisterAccountMutation();
  const [signInAccount] = useSignInAccountMutation();
  const [deleteCustomer] = useDeleteCustomerMutation();

  const customer = useSelector(getStripeCustomer);

  const navigate = useNavigate();
  const handleSetup = (formData: {
    firstName: string;
    lastName: string;
    profilePic: string;
    logo: File | null | undefined;
    company: string | null;
    role: string | null;
  }) => {
    registerAccount({
      profile: formData,
      email: email,
      password: password,
      subscription: subscription,
      stripeSubscription: stripeSubscription,
      customer: customer,
    }).then(() => {
      signInAccount({ email: email, password: password }).then(() => {
        navigate('/creating-account');
      });
    });
  };

  const handleBackClick = () => {
    if (subscription?.id !== 1) {
      setCreationStep(2);
    } else {
      deleteCustomer({customer: customer});
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
