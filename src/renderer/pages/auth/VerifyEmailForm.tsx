import React, { useState } from 'react';
import {
  useSendVerificationCodeMutation,
  useVerifyEmailMutation,
} from '../../../services/authAPI';

interface VerifyEmailFormProps {
  email: string;
  setCreationStep: React.Dispatch<React.SetStateAction<number>>;
}

const VerifyEmailForm: React.FC<VerifyEmailFormProps> = ({
  email,
  setCreationStep,
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  //   const [sendingCode, setSendingCode] = useState(false)
  const [reachedLimit, setReachedLimit] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [sendVerificationCode, { isLoading }] =
    useSendVerificationCodeMutation();
  const [verifyEmail] = useVerifyEmailMutation();

  const handleSendNewVerificationCode = async () => {
    const data = {
      email: email,
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

  const handleEmailVerifcation = async () => {
    const data = {
      email: email,
      code: verificationCode,
    };
    verifyEmail(data).then((res) => {
      if ('data' in res) {
        setIsValid(res.data.isValid);
        setErrorMessage(res.data.message);
        if (res.data.isValid == true) {
          setCreationStep(2);
        }
      } else {
        setIsValid(false);
      }
    });
  };

  const handleBackClick = () => {
    setCreationStep(0);
  };

  return (
    <div>
      <h1 className='flowplanr-header'>Flowplanr</h1>
      <div className='auth-form'>
        <h2 className='auth-form-heading'>Verify your email</h2>
        <p className='auth-form-info'>
          We've sent a one-time use 6-digit code to verify your email address at{' '}
          {email}. It expires in 15 minutes. Don't see it? Check your spam
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
          onClick={handleEmailVerifcation}
        >
          Verify
        </button>
        <button className='auth-form-button' onClick={handleBackClick}>
          Back
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

export default VerifyEmailForm;