import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import '../../styles/onboarding.scss';
import OBPageOne from './OnboardingPageOne';
import OBPageTwo from './OnboardingPageTwo';
import OBPageThree from './OnboardingPageThree';
import OBPageFour from './OnboardingPageFour';
import { completeOnboarding } from '../../../services/settingsSlice';

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const dispatch = useDispatch()

  const renderStepComponent = () => {
    switch (currentStep) {
      case 0:
        return <OBPageOne />;
      case 1:
        return <OBPageTwo />;
      case 2:
        return <OBPageThree />;
      case 3:
        return <OBPageFour />;
    }
  };

  const handleStepChange = (button: string) => {
    if (button == 'back') {
      setCurrentStep(currentStep - 1);
    }
    if (button == 'next') {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFinishOnboarding = () => {
    console.log("done")
   dispatch(completeOnboarding())
  };

  return (
    <div className='onboarding-container'>
      <div className='onboarding-field'>
        {renderStepComponent()}
        <div className='onboarding-buttons'>
          {currentStep != 3 ? (
            <>
              {currentStep != 0 && (
                <button
                  className='button-brand-pink'
                  onClick={() => handleStepChange('back')}
                >
                  Back
                </button>
              )}

              <button
                className='button-brand-light-blue'
                onClick={() => handleStepChange('next')}
              >
                Next
              </button>
            </>
          ) : (
            <>
             <button
                  className='button-brand-pink'
                  onClick={() => handleStepChange('back')}
                >
                  Back
                </button>
              <button
                className='button-brand-purple'
                onClick={handleFinishOnboarding}
              >
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
