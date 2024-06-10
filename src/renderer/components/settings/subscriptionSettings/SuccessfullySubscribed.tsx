import React from 'react';

interface SuccessfullySubscribedProps {
  setSuccessfullySubscribedAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuccessfullySubscribed: React.FC<SuccessfullySubscribedProps> = ({
  setSuccessfullySubscribedAlert,
}) => {

  //possibly add a fetch here for paymnet

  return (
    <div className='successfully-subbed-container'>
      <div className='successfully-subbed-alert-box'>
        <h2>Success!</h2>
        <h3>Your subsciption plan has been updated.</h3>
        <button
          className='button-brand-lighter-blue close-button'
          onClick={() => setSuccessfullySubscribedAlert(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessfullySubscribed;
