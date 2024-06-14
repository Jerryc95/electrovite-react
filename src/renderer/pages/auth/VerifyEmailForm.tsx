import React, { useState } from 'react';

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
  const [reachedLimit, setReachedLimit] = useState(false);

  const handleSendNewVerificationCode = async () => {
    const url = 'http://localhost:3000/auth/send-verification-email';
    const data = {
      email: email,
    };
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    //   const responseData = await response.json();
  setReachedLimit(false)
    } catch (error) {
        setReachedLimit(true);
      console.log(error);
    }
  };

  const handleEmailVerifcation = async () => {
    const url = 'http://localhost:3000/auth/verify-email';
    const data = {
      email: email,
      code: verificationCode,
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (responseData.isValid == true) {
        setCreationStep(2);
      } else {
        setIsValid(false);
      }
    } catch (error) {
      console.log(error);
      setReachedLimit(true);
    }
  };

  const handleBackClick = () => {
    setCreationStep(0);
  };

  return (
    <div>
      <h1>Flowplanr</h1>
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
          <p className='email-check-alert'>Invalid code</p>
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
