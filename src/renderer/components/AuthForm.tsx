import React, { useState } from 'react';

interface AuthFormProps {
  type: 'signin' | 'signup';
  onSubmit: (formData: { email: string; password: string }) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault;
    if (type === 'signup' && password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    onSubmit({ email, password });
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>{type === 'signup' ? 'Sign Up' : 'Sign In'}</h2>
      <label>
        Email:
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {type === 'signup' && (
        <label>
          Confirm Password:
          <input
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
      )}
      <button>{type === 'signup' ? 'Create Account' : 'Sign In'}</button>
    </form>
  );
};

export default AuthForm;
