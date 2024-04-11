import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../../../services/store';
import AuthForm from '$renderer/components/AuthForm';
import { useForgotPasswordMutation } from '../../../services/authAPI';

const ForgotPasswordPage: React.FC = () => {
    const [ForgotPassword] = useForgotPasswordMutation()
  const handleResetPassword = async (formData: {
    email: string;
    password: string;
  }) => {
    ForgotPassword(formData).then((data) => {
        if ('error' in data) {
            alert('No account found.');
          } else {
          alert("An email has been sent to reset your password.")
          }
    })
  };

  return (
    <div>
      <div>
        <AuthForm type='forgot' onSubmit={handleResetPassword} />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
