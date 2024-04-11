import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    if (newPassword == '') {
      return alert('Please enter a new password.');
    }
    if (confirmNewPassword == '') {
      return alert('please confirm new password.');
    }
    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match.');
    }
    console.log('submitted');
  };

  return (
    <div>
      <h1>Flowplanr</h1>
      <form className='auth-form' onSubmit={handleSubmit}>
        <h2 className='auth-form-heading'>Resetting Password for EMAIL HERE</h2>
        <label className='auth-form-label'>
          New Password:
          <input
            className='auth-form-input'
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <label className='auth-form-label'>
          Confirm New Password:
          <input
            className='auth-form-input'
            type='password'
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </label>
        <button className='auth-form-button'>Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
