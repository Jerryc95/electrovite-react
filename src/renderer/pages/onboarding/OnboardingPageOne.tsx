import React, { useState, useEffect, useMemo } from 'react';

import flowplanrIcon from '../../../../assets/flowplanrIcon.png';

const OBPageOne: React.FC = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const features = useMemo(
    () => ['Project Management', 'CRM', 'Bookkeeping'],
    [],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prevIndex) => (prevIndex + 1) % features.length); // Increment index cyclically
    }, 2000); // Adjust the duration of each slide as needed

    return () => clearInterval(interval); // Clean up interval
  }, [features]);

  return (
    <div className='onboarding-page-container'>
      <div className='app-icon-container'>
        <img className='app-icon' src={flowplanrIcon} />
      </div>
      <div>
        <h1>
          Welcome to <span>Flowplanr</span>
        </h1>
        <h2>Productivity Designed For You</h2>
        <ul>
          {' '}
          {features.map((feature, index) => (
            <li
              className={`animated-text ${
                index === currentFeature ? 'active' : ''
              }`}
              key={index}
            >
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OBPageOne;
