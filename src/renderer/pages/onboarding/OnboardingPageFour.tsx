import React from 'react';

import flowplanrIcon from '../../../../assets/flowplanrIcon.png';

const OBPageFour: React.FC = () => {
  return (
    <div className='onboarding-page-container'>
         <div className='app-icon-container'>
        <img
          className='app-icon'
          src={flowplanrIcon}
        />
      </div>
      <h1>Get Started</h1>
      <p className='onboarding-subheader'>
        Create an account for free and get started today
      </p>
    </div>
  );
};

export default OBPageFour;
