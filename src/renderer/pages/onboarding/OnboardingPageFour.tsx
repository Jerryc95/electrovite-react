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
      <h2>Get Started</h2>
      <p className='onboarding-subheader'>
        Create an account and get started today
      </p>
    </div>
  );
};

export default OBPageFour;
