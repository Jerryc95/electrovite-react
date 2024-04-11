import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import '../styles/authForm.scss';

interface AuthFormProps {
  type: 'signin' | 'signup' | 'forgot';
  onSubmit: (formData: { email: string; password: string }) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
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
    } catch (error) {
      console.error('Error checking email availability:', error);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email == '') {
      return alert('Please enter an email');
    }

    if (password == '' && type !== 'forgot') {
      return alert('Please enter password.');
    }

    if (type === 'signup' && confirmPassword == '') {
      return alert('please confirm password.');
    }

    if (type === 'signup' && password !== confirmPassword) {
      return alert('Passwords do not match.');
    }
    onSubmit({ email, password });
  };

  const sumbitTexts = {
    signup: 'Create Account',
    signin: 'Sign In',
    forgot: 'Send Email',
  };

  const headingTexts = {
    signup: 'Sign Up',
    signin: 'Sign In',
    forgot: 'Forgot Password',
  };

  return (
    <>
      <h1>Flowplanr</h1>
      <form className='auth-form' onSubmit={handleSubmit}>
        <h2 className='auth-form-heading'>{headingTexts[type]}</h2>
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
        {type !== 'forgot' && (
          <label className='auth-form-label'>
            Password:
            <input
              className='auth-form-input'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        )}

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
        <button
          className='auth-form-button'
          disabled={!isEmailAvailable && type == 'signup'}
        >
          {sumbitTexts[type]}
        </button>
        {type === 'signup' && (
          <>
            <p className='auth-form-callout'>
              Already have an account?{' '}
              <Link to='/'>
                <span className='auth-form-link'>Sign in here.</span>
              </Link>
            </p>
            <p className='auth-form-callout'>
              Forget your password?{' '}
              <Link to='/reset-password'>
                <span className='auth-form-link'>Reset it here.</span>
              </Link>
            </p>
          </>
        )}

        {type === 'signin' && (
          <>
            <p className='auth-form-callout'>
              Don't have an account?{' '}
              <Link to='/register'>
                <span className='auth-form-link'>Sign up here.</span>
              </Link>
            </p>
            <p className='auth-form-callout'>
              Forget your password?{' '}
              <Link to='/forgot-password'>
                <span className='auth-form-link'>Reset it here.</span>
              </Link>
            </p>
          </>
        )}
        {type === 'forgot' && (
          <>
            <p className='auth-form-callout'>
              Already have an account?{' '}
              <Link to='/'>
                <span className='auth-form-link'>Sign in here.</span>
              </Link>
            </p>
            <p className='auth-form-callout'>
              Don't have an account?{' '}
              <Link to='/register'>
                <span className='auth-form-link'>Sign up here.</span>
              </Link>
            </p>
          </>
        )}
      </form>
    </>
  );
};

export default AuthForm;
