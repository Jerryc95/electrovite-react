import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import '../styles/authForm.scss';

interface AuthFormProps {
  type: 'signin' | 'signup';
  onSubmit: (formData: { email: string; password: string }) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);

  const handleCheckEmail = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/auth/email-check?email=${email}`,
      );
      const data = await response.json();
      setIsEmailAvailable(data.isAvailable);
      console.log(data);
    } catch (error) {
      console.error('Error checking email availability:', error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email == '') {
      return alert('Please enter an email');
    }

    if (password == '') {
      return alert('Please enter password.');
    }

    if (type === 'signup' && confirmPassword == '') {
      return alert('please confirm password.');
    }

    if (type === 'signup' && password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    onSubmit({ email, password });
  };
  return (
    <>
      <h1>FlowPlanr</h1>
      <form className='auth-form' onSubmit={handleSubmit}>
        <h2 className='auth-form-heading'>
          {type === 'signup' ? 'Sign Up' : 'Sign In'}
        </h2>
        <label className='auth-form-label'>
          Email:
          <input
            className='auth-form-input'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleCheckEmail}
          />
        </label>
        {!isEmailAvailable && type == 'signup' && (
          <p className='email-check-alert'>Email is already use.</p>
        )}
        <label className='auth-form-label'>
          Password:
          <input
            className='auth-form-input'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {type === 'signup' && (
          <label className='auth-form-label'>
            Confirm Password:
            <input
              className='auth-form-input'
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </label>
        )}
        <button className='auth-form-button' disabled={!isEmailAvailable && type == 'signup'}>
          {type === 'signup' ? 'Create Account' : 'Sign In'}
        </button>
        {type === 'signup' ? (
          <p className='auth-form-callout'>
            Already have an account?{' '}
            <Link to='/'>
              <span className='auth-form-link'>Sign in here.</span>
            </Link>
          </p>
        ) : (
          <p className='auth-form-callout'>
            Don't have an account?{' '}
            <Link to='/register'>
              <span className='auth-form-link'>Sign up here.</span>
            </Link>
          </p>
        )}
      </form>
    </>
  );
};

export default AuthForm;
