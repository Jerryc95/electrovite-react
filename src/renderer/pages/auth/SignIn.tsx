import React from 'react';
import { useNavigate } from 'react-router-dom';

import AuthForm from '$renderer/components/AuthForm';
import { useSignInAccountMutation } from '../../../services/authAPI';
// import { useFetchProfileMutation } from '../../../services/profileAPI';

const SignInPage: React.FC = () => {
  // const accountState = useSelector((state: RootState) => state.accountReducer);
  const [signInUser] = useSignInAccountMutation();
  // const [fetchProfile] = useFetchProfileMutation();
  const navigate = useNavigate();

  const handleSignIn = async (formData: {
    email: string;
    password: string;
  }) => {
    signInUser(formData).then((data) => {
      if ('error' in data) {
        alert('No account found. Email or password are incorrect.');
      } else {
        navigate('/loading-account');
      }
    });
  };

  return (
    <div>
      <AuthForm type='signin' onSubmit={handleSignIn} />
    </div>
  );
};

export default SignInPage;
