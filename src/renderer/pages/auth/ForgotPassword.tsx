import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

import AuthForm from '$renderer/components/AuthForm';
import { useForgotPasswordMutation } from '../../../services/authAPI';

const ForgotPasswordPage: React.FC = () => {
  const [ForgotPassword, { isLoading }] = useForgotPasswordMutation();
  const handleResetPassword = async (formData: {
    email: string;
    password: string;
  }) => {
    ForgotPassword(formData).then((data) => {
      if ('error' in data) {
        alert('No account found.');
      } else {
        alert('An email has been sent to reset your password.');
      }
    });
  };

  return (
    <div>
      <div>
        <AuthForm
          type='forgot'
          isLoading={isLoading}
          onSubmit={handleResetPassword}
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
