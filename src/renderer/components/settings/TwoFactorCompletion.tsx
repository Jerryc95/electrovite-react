import React from 'react';

interface TwoFactorCompletionProps {
  recoveryKey: string;
  setShowingTwoFactorSetup: React.Dispatch<React.SetStateAction<boolean>>;
  setShowingTwoFactorComplete: React.Dispatch<React.SetStateAction<boolean>>;
}

const TwoFactorCompletion: React.FC<TwoFactorCompletionProps> = ({
  recoveryKey,
  setShowingTwoFactorSetup,
  setShowingTwoFactorComplete,
}) => {
  const handleClose = () => {
    setShowingTwoFactorSetup(false);
    setShowingTwoFactorComplete(false);
  };

  return (
    <div className='two-factor-confirmation-container'>
      <div className='two-factor-confirmation-field'>
        <h2>Two-Factor Authentication Setup Complete!</h2>
        <p>
          For your records, please retain this Recovery Key in a secure
          location. This code will be essential for regaining access to your
          account in the event you are unable to utilize your two-factor
          authentication code.
        </p>
        <p className='two-factor-recovery-key'>Recovery Key: {recoveryKey}</p>
        <button className='button-brand-dark-blue' onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TwoFactorCompletion;
