import React, { useState } from 'react';

import {
  useSendVerificationCodeMutation,
  useUpdateEmailMutation,
  useVerifyEmailMutation,
} from '../../../services/authAPI';

interface ConfirmEmailModalProps {
  setShowingConfirmEmailModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingSecurity: React.Dispatch<React.SetStateAction<boolean>>;
  newEmail: string;
  id: number | undefined;
}

const ConfirmEmailModal: React.FC<ConfirmEmailModalProps> = ({
  setShowingConfirmEmailModal,
  setEditingSecurity,
  newEmail,
  id,
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [reachedLimit, setReachedLimit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [updateEmail] = useUpdateEmailMutation();
  const [sendVerificationCode, { isLoading }] =
    useSendVerificationCodeMutation();
  const [verifyEmail] = useVerifyEmailMutation();

  const handleSendNewVerificationCode = async () => {
    const data = {
      email: newEmail,
    };

    sendVerificationCode(data).then((res) => {
      if ('data' in res) {
        if (res.data.isSent) {
          setReachedLimit(false);
          console.log(1);
        }
      } else {
        setReachedLimit(true);
      }
    });
  };

  const handleUpdateEmail = () => {
    const data = {
      email: newEmail,
      code: verificationCode,
    };
    verifyEmail(data).then((res) => {
      if ('data' in res) {
        setIsValid(res.data.isValid);
        setErrorMessage(res.data.message);
        if (res.data.isValid == true) {
          updateEmail({ id: id, email: newEmail });
          setShowingConfirmEmailModal(false);
          setEditingSecurity(false);
        }
      } else {
        setIsValid(false);
      }
    });

    
  };

  const handleBackClick = () => {
    setShowingConfirmEmailModal(false);
    setEditingSecurity(false);
  };

  return (
    <div className='confirm-email-container'>
      <div className='auth-form'>
        <h2 className='auth-form-heading'>Verify your new email</h2>
        <p className='auth-form-info'>
          We've sent a one-time use 6-digit code to verify your email address at{' '}
          {newEmail}. It expires in 15 minutes. Don't see it? Check your spam
          folder or{' '}
          <span
            className='auth-form-link'
            onClick={handleSendNewVerificationCode}
          >
            press here to resend a code
          </span>
          .
        </p>
        <label className='auth-form-label'>
          6-digit code:
          <input
            className='auth-form-input'
            type='text'
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </label>
        <button
          className='auth-form-button button-brand-light-blue'
          onClick={handleUpdateEmail}
        >
          Verify
        </button>
        <button className='auth-form-button' onClick={handleBackClick}>
          Cancel
        </button>
        {isValid != null && isValid == false && (
          <p className='email-check-alert'>{errorMessage}</p>
        )}
        {reachedLimit && (
          <p className='email-check-alert'>
            Too many attempts. Please try again in 15 minutes.
          </p>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmailModal;
