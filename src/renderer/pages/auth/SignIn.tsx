import React from 'react';
import { useNavigate } from 'react-router-dom';

import AuthForm from '$renderer/components/AuthForm';
import { useSignInAccountMutation } from '../../../services/authAPI';

const SignInPage: React.FC = () => {
  const [signInUser] = useSignInAccountMutation();
  const navigate = useNavigate();

  const handleSignIn = async (formData: {
    email: string;
    password: string;
  }) => {
    signInUser(formData).then((data) => {
      console.log(data);
      if ('error' in data) {
        alert('No account found.');
      } else {
        navigate('/dashboard');
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
